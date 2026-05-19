import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes } from '../../Constants.js';

class ElementalInversion extends DrawCard {
    static id = 'elemental-inversion';

    setupCardAbilities() {
        this.action({
            title: 'Switch the contested ring',
            condition: context => context.game.isDuringConflict(),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an uncontested ring',
                ringCondition: ring => !ring.isContested() && !ring.isRemovedFromGame(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.placeFateOnRing(context => ({
                        origin: context.ring,
                        target: context.game.currentConflict.ring,
                        amount: context.ring.fate
                    })),
                    AbilityDsl.actions.switchConflictElement()
                ])
            },
            effect: 'move all fate from the {0} and switch it with the contested ring'
        });
    }
}


export default ElementalInversion;
