import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';

class NightshadeInfiltrator extends DrawCard {
    static id = 'nightshade-infiltrator';

    setupCardAbilities() {
        this.conflictAction('Give a character -3/-3')
            .cost(AbilityDsl.costs.dishonorSelf())
            .target({
                player: Players.Self,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyBothSkills(-3)
            }))
            .effect('give {0} -3{1}/-3{2}', () => ['military', 'political']);
    }
}

export default NightshadeInfiltrator;
