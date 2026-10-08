import { msg } from '../../../GameChat.js';
import { CardType, Location } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DesperateDefense extends DrawCard {
    static id = 'desperate-defense';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .condition((context) => context.player.cardsInPlay.some((card) => card.isParticipating()))
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(3)
                })
            })
            .chatText('increase the strength of an attacked province by 3')
            .max(perConflict(1));
    }
}
