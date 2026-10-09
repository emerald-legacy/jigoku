import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import {
    bow, chooseAction, conditional, draw, ifAble, joint, multiple, noAction, onAffinity, optional, sequential
} from '../../../build/server/game/GameActions/GameActions.js';

describe('composite game actions and default targets', function() {
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
            this.context = new ThenAbility(this.whisperer, {}).createContext(this.player1.player);

            // the targets each action gets when the composite asks the actions it would resolve
            this.targetsPassed = (composite, actions, overrides = {}) => {
                const spies = actions.map((action) => spyOn(action, 'hasTargetsChosenByInitiatingPlayer').and.callThrough());
                composite.hasTargetsChosenByInitiatingPlayer(this.context, overrides);
                return actions.map((action, i) => spies[i].calls.count() > 0
                    ? action.getProperties(this.context, spies[i].calls.mostRecent().args[1]).target
                    : 'not asked');
            };
        });

        it('leaves each action its own default when the composite has no target', function() {
            const composites = [
                (a, b) => multiple([a, b]),
                (a, b) => joint([a, b]),
                (a, b) => sequential([a, b]),
                (a, b) => ifAble({ ifAbleAction: a, otherwiseAction: b }),
                (a, b) => chooseAction({ choices: { A: a, B: b } })
            ];
            for(const build of composites) {
                const drawCard = draw();
                const bowSource = bow();
                expect(this.targetsPassed(build(drawCard, bowSource), [drawCard, bowSource])).toEqual([[this.player1.player], [this.whisperer]]);
            }
            const drawCard = draw();
            expect(this.targetsPassed(conditional({ condition: true, trueGameAction: drawCard, falseGameAction: noAction() }), [drawCard])).toEqual([[this.player1.player]]);
            const bowSource = bow();
            expect(this.targetsPassed(onAffinity({ trait: 'air', gameAction: noAction(), noAffinityGameAction: bowSource }), [bowSource])).toEqual([[this.whisperer]]);
            const drawOptional = draw();
            expect(this.targetsPassed(optional({ gameAction: drawOptional }), [drawOptional])).toEqual([[this.player1.player]]);
        });

        it('passes its target on when it has one', function() {
            const bowTarget = bow();
            expect(this.targetsPassed(multiple([bowTarget]), [bowTarget], { target: this.brash })).toEqual([[this.brash]]);
        });

        it('passes an empty target on when it was given one', function() {
            const bowNothing = bow();
            expect(this.targetsPassed(multiple([bowNothing]), [bowNothing], { target: [] })).toEqual([[]]);
        });

        it('applies through nested composites', function() {
            const drawCard = draw();
            const outer = sequential([conditional({ condition: true, trueGameAction: drawCard, falseGameAction: noAction() })]);
            expect(this.targetsPassed(outer, [drawCard])).toEqual([[this.player1.player]]);

            const bowTarget = bow();
            const inner = conditional({ condition: true, trueGameAction: bowTarget, falseGameAction: noAction() });
            expect(this.targetsPassed(multiple([inner]), [bowTarget], { target: this.brash })).toEqual([[this.brash]]);
        });

        it('sets nothing on the actions it holds', function() {
            const bowTarget = bow();
            const inner = conditional({ condition: true, trueGameAction: bowTarget, falseGameAction: noAction() });
            multiple([inner]).hasTargetsChosenByInitiatingPlayer(this.context, { target: this.brash });

            expect(bowTarget.getProperties(this.context).target).toEqual([this.whisperer]);
        });
    });
});
