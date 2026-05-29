import { CardTypes, EventNames, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';
import { Duel } from '../../../Duel.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class DestinyRevealed extends DrawCard {
    static id = 'destiny-revealed';

    setupCardAbilities() {
        this.duelStrike({
            title: 'Place a fate on a character',
            duelCondition: (duel, context) => duel.winnerController === context.player,
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => ((context as TriggeredAbilityContext).event.duel as Duel).isInvolved(card),
                message: '{0} places a fate from their fate pool on {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.placeFate((context) => ({
                    origin: context.player
                }))
            }))
        });

        this.wouldInterrupt({
            title: 'Cancel a ring effect',
            when: {
                onMoveFate: (event: EventPayload<EventNames.OnMoveFate>, context) =>
                    event.context?.source.type === 'ring' &&
                    !!event.origin && 'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    event.fate > 0,
                onCardHonored: targetedByOpponentRingEffect,
                onCardDishonored: targetedByOpponentRingEffect,
                onCardBowed: targetedByOpponentRingEffect,
                onCardReadied: targetedByOpponentRingEffect
            },
            gameAction: AbilityDsl.actions.cancel(),
            effect: 'cancel the effects of the {1}',
            effectArgs: (context) => [context.event.context?.source]
        });
    }
}

type CardStatusEvent =
    | EventPayload<EventNames.OnCardHonored>
    | EventPayload<EventNames.OnCardDishonored>
    | EventPayload<EventNames.OnCardBowed>
    | EventPayload<EventNames.OnCardReadied>;

function targetedByOpponentRingEffect(event: CardStatusEvent, context: TriggeredAbilityContext<any>) {
    return event.card?.controller === context.player && event.context?.source.type === 'ring';
}
