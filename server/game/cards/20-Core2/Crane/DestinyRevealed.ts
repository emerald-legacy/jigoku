import { CardType, EventName, Players } from '../../../Constants.js';
import { placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import Ring from '../../../Ring.js';
import { msg } from '../../../GameChat.js';
export default class DestinyRevealed extends DrawCard {
    static id = 'destiny-revealed';

    setupCardAbilities() {
        this.duelStrike('Place a fate on a character', (duel, context) => duel.winnerController === context.player)
            .selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                hidePromptIfSingleCard: true,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => context.event.duel.isInvolved(card),
                message: '{0} places a fate from their fate pool on {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: placeFate((context) => ({
                    origin: context.player
                }))
            }));

        this.wouldInterrupt('Cancel a ring effect')
            .when({
                onMoveFate: (event, context) =>
                    event.context?.source instanceof Ring &&
                    !!event.origin && 'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    (event.fate ?? 0) > 0,
                onCardHonored: targetedByOpponentRingEffect,
                onCardDishonored: targetedByOpponentRingEffect,
                onCardBowed: targetedByOpponentRingEffect,
                onCardReadied: targetedByOpponentRingEffect
            })
            .cancel()
            .effect((context) => msg`cancel the effects of the ${context.event.context?.source}`);
    }
}

type CardStatusEvent =
    | EventPayload<EventName.OnCardHonored>
    | EventPayload<EventName.OnCardDishonored>
    | EventPayload<EventName.OnCardBowed>
    | EventPayload<EventName.OnCardReadied>;

function targetedByOpponentRingEffect(event: CardStatusEvent, context: TriggeredAbilityContext) {
    return event.card.controller === context.player && event.context?.source instanceof Ring;
}
