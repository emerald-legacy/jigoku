import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { TargetModes } from '../../Constants';

class AcclaimedGeishaHouse extends DrawCard {
    static id = 'acclaimed-geisha-house';

    setupCardAbilities() {
        this.action({
            title: 'Switch the contested ring',

            cost: AbilityDsl.costs.dishonor({ cardCondition: card => card.isParticipating() }),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.switchConflictElement()
            },
            effect: 'switch the contested ring with the {0}'
        });
    }
}


export default AcclaimedGeishaHouse;
