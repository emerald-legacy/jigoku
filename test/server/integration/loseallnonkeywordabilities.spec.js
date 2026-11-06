import { ResolvableAbility } from '../../../build/server/game/ResolvableAbility.js';
import { cardLastingEffect } from '../../../build/server/game/GameActions/GameActions.js';
import { loseAllNonKeywordAbilities } from '../../../build/server/game/effects.js';
import { Duration } from '../../../build/server/game/Constants.js';

describe('loseAllNonKeywordAbilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-liar', 'asahina-storyteller', 'doji-whisperer']
                }
            });
            this.liar = this.player1.findCardByName('bayushi-liar');
            this.storyteller = this.player1.findCardByName('asahina-storyteller');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.whisperer.honor();
            this.game.checkGameState(true);

            this.loseAll = (target) => {
                const context = new ResolvableAbility(target, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => cardLastingEffect({
                    duration: Duration.Custom,
                    effect: loseAllNonKeywordAbilities()
                }).resolve(target, context));
                this.game.continue();
            };
        });

        it('keeps a printed keyword', function() {
            expect(this.liar.hasKeyword('sincerity')).toBe(true);
            this.loseAll(this.liar);
            expect(this.liar.hasKeyword('sincerity')).toBe(true);
        });

        it('keeps the printed keyword but drops the other constant abilities', function() {
            expect(this.whisperer.hasKeyword('sincerity')).toBe(true);
            this.loseAll(this.storyteller);
            expect(this.storyteller.hasKeyword('sincerity')).toBe(true);
            expect(this.whisperer.hasKeyword('sincerity')).toBe(false);
        });
    });
});
