import { Duration } from '../../../build/server/game/Constants.js';
import { setBaseDash, setDash } from '../../../build/server/game/effects.js';

describe('Dash skill summary', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.applyDash = (effect) => {
                this.brash.applyDurationEffect(Duration.UntilEndOfPhase, { match: this.brash, effect });
                this.game.checkGameState(true);
            };
            // what the client receives
            this.sentSummary = () => JSON.parse(JSON.stringify(this.brash.getSummary(this.player1.player).militarySkillSummary));
        });

        it('sends a base dash without an amount, so the client does not count it as 0', function() {
            this.applyDash(setBaseDash('military'));
            expect(this.brash.getMilitarySkill()).toBe(0);

            const summary = this.sentSummary();
            expect(summary.stat).toBe('-');
            const dash = summary.modifiers.find((modifier) => modifier.overrides);
            expect(dash).toBeDefined();
            expect('amount' in dash).toBe(false);
            expect(summary.modifiers.filter((modifier) => !modifier.overrides).every((modifier) => typeof modifier.amount === 'number')).toBe(true);
        });

        it('sends a set dash without an amount', function() {
            this.applyDash(setDash('military'));
            expect(this.brash.getMilitarySkill()).toBe(0);

            const summary = this.sentSummary();
            expect(summary.stat).toBe('-');
            expect(summary.modifiers.length).toBe(1);
            expect('amount' in summary.modifiers[0]).toBe(false);
        });

        it('dashes only the skill a set dash names', function() {
            const military = this.brash.getMilitarySkill();
            this.applyDash(setDash('political'));
            expect(this.brash.getMilitarySkill()).toBe(military);
            expect(this.sentSummary().stat).toBe(military.toString());
            expect(this.brash.getSummary(this.player1.player).politicalSkillSummary.stat).toBe('-');
        });

        it('keeps the amounts of ordinary modifiers', function() {
            const summary = this.sentSummary();
            expect(summary.stat).toBe(this.brash.getMilitarySkill().toString());
            expect(summary.modifiers.every((modifier) => typeof modifier.amount === 'number')).toBe(true);
        });
    });
});
