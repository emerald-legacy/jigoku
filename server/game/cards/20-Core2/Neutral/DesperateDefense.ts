import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { cardLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DesperateDefense extends DrawCard {
    static id = 'desperate-defense';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .condition((context) => context.player.cardsInPlay.some((card) => card.isParticipating()))
            .gameAction(selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} increases the strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(3)
                })
            })))
            .effect('increase the strength of an attacked province by 3')
            .max(AbilityDsl.limit.perConflict(1));
    }
}
