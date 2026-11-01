import { reduceNextPlayedCardCost } from '../../../effects.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { CardType, Location, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { isReducibleAttachmentPlay } from '../../attachmentPlay.js';

export default class EarnestSculptor extends DrawCard {
    static id = 'earnest-sculptor';

    public override setupCardAbilities() {
        this.action('Search top 8 card for a spell')
            .deckSearch({
                cardsToLookAt: 8,
                cardCondition: (card) => card.hasTrait(Trait.Spell),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText('look at the top 8 cards of their deck');

        this.interrupt('Reduce cost of next Jade card')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event &&
                    event.player === context.player &&
                    event.card.hasTrait(Trait.Jade) &&
                    event.context !== undefined &&
                    event.context.ability.getReducedCost(event.context) > 0,
                onAbilityResolverInitiated: (event, context) =>
                    isReducibleAttachmentPlay(event.context) &&
                    event.context.player === context.player &&
                    event.context.source.hasTrait(Trait.Jade)
            })
            .playerLastingEffect((context) => ({
                effect: reduceNextPlayedCardCost(
                    1,
                    (card) =>
                        card === context.event.card || card === context.event.context.source
                )
            }))
            .chatText((context) => msg`reduce the cost of ${context.event.context.source} by 1`);
    }
}
