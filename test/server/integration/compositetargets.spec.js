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

            this.targetsOf = (action) => action.getProperties(this.context).target;
        });

        it('leaves each action its own default when the composite has no target', function() {
            const composites = [
                (a, b) => multiple([a, b]),
                (a, b) => joint([a, b]),
                (a, b) => sequential([a, b]),
                (a, b) => conditional({ condition: true, trueGameAction: a, falseGameAction: b }),
                (a, b) => ifAble({ ifAbleAction: a, otherwiseAction: b }),
                (a, b) => onAffinity({ trait: 'air', gameAction: a, noAffinityGameAction: b }),
                (a, b) => chooseAction({ options: { A: { action: a }, B: { action: b } } }),
                (a) => optional({ gameAction: a })
            ];
            for(const build of composites) {
                const drawCard = draw();
                const bowSource = bow();
                build(drawCard, bowSource).getProperties(this.context);

                expect(this.targetsOf(drawCard)).toEqual([this.player1.player]);
                expect(this.targetsOf(bowSource)).toEqual([this.whisperer]);
            }
        });

        it('passes its target on when it has one', function() {
            const bowTarget = bow();
            multiple([bowTarget]).getProperties(this.context, { target: this.brash });

            expect(this.targetsOf(bowTarget)).toEqual([this.brash]);
        });

        it('passes an empty target on when it was given one', function() {
            const bowNothing = bow();
            const composite = multiple([bowNothing]);
            composite.setDefaultTarget(() => []);
            composite.getProperties(this.context);

            expect(this.targetsOf(bowNothing)).toEqual([]);
        });

        it('applies through nested composites', function() {
            const drawCard = draw();
            sequential([conditional({ condition: true, trueGameAction: drawCard, falseGameAction: noAction() })]).getProperties(this.context);
            expect(this.targetsOf(drawCard)).toEqual([this.player1.player]);

            const bowTarget = bow();
            const inner = conditional({ condition: true, trueGameAction: bowTarget, falseGameAction: noAction() });
            multiple([inner]).getProperties(this.context, { target: this.brash });
            inner.getProperties(this.context);
            expect(this.targetsOf(bowTarget)).toEqual([this.brash]);
        });
    });
});
