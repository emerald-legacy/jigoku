import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BayushiYojiro extends DrawCard {
    static id = 'bayushi-yojiro';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: (card: DrawCard) => card.isParticipating(),
            effect: [
                AbilityDsl.effects.honorStatusDoesNotModifySkill(),
                AbilityDsl.effects.honorStatusDoesNotAffectLeavePlay(),
                AbilityDsl.effects.taintedStatusDoesNotCostHonor()
            ]
        });
    }
}


export default BayushiYojiro;
