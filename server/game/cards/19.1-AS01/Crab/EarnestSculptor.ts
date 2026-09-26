import AbilityDsl from '../../../abilitydsl.js';
import type BaseAction from '../../../BaseAction.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayAttachmentAction } from '../../../PlayAttachmentAction.js';

export default class EarnestSculptor extends DrawCard {
    static id = 'earnest-sculptor';

    public setupCardAbilities() {
        this.action('Search top 8 card for a spell')
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: 8,
                cardCondition: (card) => card.hasTrait('spell'),
                gameAction: AbilityDsl.actions.moveCard({
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
                    (event.context.ability as BaseAction).getReducedCost(event.context) > 0,
                onAbilityResolverInitiated: (event, context) =>
                    event.context !== undefined &&
                    (event.context.source.type === CardType.Attachment ||
                        event.context.ability instanceof PlayAttachmentAction) &&
                    event.context.player === context.player &&
                    event.context.source.hasTrait('jade') &&
                    (event.context.ability as BaseAction).getReducedCost(event.context) > 0
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: BaseCard) =>
                        card === context.event.card || card === context.event.context.source
                )
            })))
            .effect('reduce the cost of {1} by 1', (context) => [context.event.context.source]);
    }
}
