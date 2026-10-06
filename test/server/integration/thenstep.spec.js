import ThenAbility from '../../../build/server/game/ThenAbility.js';
import { AbilityBuilder, actionProperties, createDraft } from '../../../build/server/game/AbilityBuilder.js';

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

describe('thenAlways() and onResolve() in the ability builder', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.context = this.game.getFrameworkContext(this.player1.player);
            this.draft = createDraft('Test', () => true);
            this.builder = new AbilityBuilder(this.draft);
        });

        it('makes a step that follows whether or not the step before resolved', function() {
            this.builder.draw(1).thenAlways().gainHonor(1);

            expect(actionProperties(this.draft).then.thenCondition(this.context)).toBe(true);
        });

        it('runs the hook when the ability starts resolving, then hands over the next step', function() {
            const calls = [];
            this.builder.draw(1).onResolve(() => calls.push('hook')).then().gainHonor(1);

            const then = actionProperties(this.draft).then;
            const step = then(this.context);
            expect(calls).toEqual(['hook']);
            expect(step.inheritTargets).toBe(true);
        });
    });
});
