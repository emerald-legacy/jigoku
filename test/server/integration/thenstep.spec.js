import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import { AbilityBuilder, toActionProps, createDraft } from '../../../build/server/game/AbilityBuilder.js';
import { bow } from '../../../build/server/game/GameActions/GameActions.js';

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

        it('sees the events and deck search of the step before', function() {
            const event = this.game.getEvent('onTestEvent', {});
            this.parent.events.push(event);
            this.parent.deckSearchSelected = [this.brash];
            const context = new ThenAbility(this.whisperer, { inheritTargets: true }).createThenContext(this.parent);

            expect(context.previousEvents).toEqual([event]);
            expect(context.events).toEqual([]);
            expect(context.deckSearchSelected).toEqual([this.brash]);
            expect(context.copy({}).previousEvents).toEqual([event]);
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

describe('afterwards(), thenIf() and onResolve() in the ability builder', function() {
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
            this.resolvedEvent = () => {
                const event = this.game.getEvent('onTestEvent', { context: this.context }, () => true);
                event.resolved = true;
                return event;
            };
            this.cancelledEvent = () => {
                const event = this.game.getEvent('onTestEvent', { context: this.context }, () => true);
                event.cancel();
                return event;
            };
        });

        it('afterwards(): the step follows whether or not the step before resolved', function() {
            this.builder.draw(1).afterwards().gainHonor(1);
            const condition = toActionProps(this.draft).then.thenCondition;

            expect(condition(this.context)).toBe(true);
            expect(condition(this.cancelledEvent())).toBe(true);
        });

        it('afterwardsIf(): only the condition decides', function() {
            this.builder.draw(1).afterwardsIf(() => true).gainHonor(1);

            expect(toActionProps(this.draft).then.thenCondition(this.context)).toBe(true);
        });

        it('thenIf(): the step before must have resolved in full, and the condition hold', function() {
            this.builder.draw(1).thenIf(() => true).gainHonor(1);
            const condition = toActionProps(this.draft).then.thenCondition;

            expect(condition(this.context)).toBe(false);
            expect(condition(this.cancelledEvent())).toBe(false);
            expect(condition(this.resolvedEvent())).toBe(true);
        });

        it('thenIf(): a condition that fails stops the step', function() {
            this.builder.draw(1).thenIf(() => false).gainHonor(1);

            expect(toActionProps(this.draft).then.thenCondition(this.resolvedEvent())).toBe(false);
        });

        it('onResolve(): runs when the ability starts resolving, before a handler too', function() {
            const calls = [];
            this.builder.onResolve(() => calls.push('hook')).handler(() => calls.push('handler'));
            const ability = new ThenAbility(this.player1.findCardByName('doji-whisperer'), toActionProps(this.draft));

            ability.executeHandler(this.context);
            expect(calls).toEqual(['hook', 'handler']);
        });

        it('onResolve(): not run when the ability is only checked for legality', function() {
            const calls = [];
            this.builder.gameAction(bow({ target: [], optional: true })).onResolve(() => calls.push('hook')).then().gainHonor(1);
            const ability = new ThenAbility(this.player1.findCardByName('doji-whisperer'), toActionProps(this.draft));

            expect(ability.checkGameActionsForPotential(this.context)).toBe(true);
            expect(calls).toEqual([]);
        });
    });
});
