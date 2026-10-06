import ThenAbility from '../../../build/server/game/ThenAbility.js';

describe('then step context', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');

            this.parent = new ThenAbility(this.whisperer, {}).createContext(this.player1.player);
            this.parent.targets.character = this.brash;
            this.parent.target = this.brash;
            this.parent.selects.choice = { choice: 'Honor' };
            this.parent.costs.dishonor = this.whisperer;
        });

        it('starts with the chosen targets, selects and costs of the step before', function() {
            const context = new ThenAbility(this.whisperer, { inheritTargets: true }).createThenContext(this.parent);

            expect(context.targets.character).toBe(this.brash);
            expect(context.target).toBe(this.brash);
            expect(context.selects.choice.choice).toBe('Honor');
            expect(context.costs.dishonor).toBe(this.whisperer);
            expect(context.originatingContext).toBe(this.parent);
        });

        it('copies the records, so its own targets stay in the step', function() {
            const context = new ThenAbility(this.whisperer, { inheritTargets: true }).createThenContext(this.parent);
            context.targets.other = this.whisperer;

            expect(this.parent.targets.other).toBeUndefined();
        });

        it('starts empty without inheritTargets', function() {
            const context = new ThenAbility(this.whisperer, {}).createThenContext(this.parent);

            expect(context.targets.character).toBeUndefined();
            expect(context.target).toBeUndefined();
            expect(context.originatingContext).toBe(this.parent);
        });
    });
});
