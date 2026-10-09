import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import {
    honorStatusDoesNotAffectLeavePlay,
    honorStatusDoesNotModifySkill,
    taintedStatusDoesNotCostHonor
} from '../../effects.js';

class BayushiYojiro extends DrawCard {
    static id = 'bayushi-yojiro';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Any,
            match: (card) => card.isParticipating(),
            effect: [
                honorStatusDoesNotModifySkill(),
                honorStatusDoesNotAffectLeavePlay(),
                taintedStatusDoesNotCostHonor()
            ]
        });
    }
}


export default BayushiYojiro;
