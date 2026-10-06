import { CardType, TargetMode } from '../../Constants.js';
import { assignRoles, dishonor, honor } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class ShamefulDisplay extends ProvinceCard {
    static id = 'shameful-display';

    setupCardAbilities() {
        this.action('Dishonor/Honor two characters')
            .targetCards({
                mode: TargetMode.Exactly,
                numCards: 2,
                cardType: CardType.Character,
                activePromptTitle: 'Select two characters',
                cardCondition: (card) => card.isParticipating()
            }, assignRoles({
                roles: { Honor: honor(), Dishonor: dishonor() },
                message: (assigned, context) => msg`${context.player} chooses to honor ${assigned.Honor} and dishonor ${assigned.Dishonor}`
            }))
            .effect('change the personal honor of {0}');
    }
}
