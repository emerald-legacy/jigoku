import { reduceNextPlayedCardCost } from '../../../effects.js';
import { deckSearch, moveCard } from '../../../GameActions/GameActions.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayAttachmentAction } from '../../../PlayAttachmentAction.js';
import { msg } from '../../../GameChat.js';

export default class EarnestSculptor extends DrawCard {
    static id = 'earnest-sculptor';

    public setupCardAbilities() {
        this.action('Search top 8 card for a spell')
            .gameAction(deckSearch({
                amount: 8,
                cardCondition: (card) => card.hasTrait('spell'),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top 8 cards of their deck');

        this.interrupt('Reduce cost of next Jade card')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event &&
                    event.player === context.player &&
                    event.card.hasTrait('jade') &&
                    event.context !== undefined &&
                    event.context.ability.getReducedCost(event.context) > 0,
                onAbilityResolverInitiated: (event, context) =>
                    event.context !== undefined &&
                    (event.context.source.type === CardType.Attachment ||
                        event.context.ability instanceof PlayAttachmentAction) &&
                    event.context.player === context.player &&
                    event.context.source.hasTrait('jade') &&
                    event.context.ability.getReducedCost(event.context) > 0
            })
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceNextPlayedCardCost(
                    1,
                    (card) =>
                        card === context.event.card || card === context.event.context.source
                )
            }))
            .effect((context) => msg`reduce the cost of ${context.event.context.source} by 1`);
    }
}
