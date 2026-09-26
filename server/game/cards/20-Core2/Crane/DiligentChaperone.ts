import { Location, CardType, CharacterStatus, EventName } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
function targetsFromEvent(context: TriggeredAbilityContext): WeakSet<BaseCard> {
    const event = context.event;
    switch(event.name) {
        case EventName.OnStatusTokenMoved:
            return new WeakSet(event.donor ? [event.donor] : []);
        case EventName.OnCardDishonored:
            return new WeakSet(event.card ? [event.card] : []);
        case EventName.OnStatusTokenDiscarded:
            return new WeakSet(event.cards);
        default:
            return new WeakSet();
    }
}

function isFriendlyCharacter(context: TriggeredAbilityContext, card: BaseCard) {
    return card.controller === context.player && card.type === CardType.Character;
}

export default class DiligentChaperone extends DrawCard {
    static id = 'diligent-chaperone';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: AbilityDsl.effects.cannotParticipateAsAttacker()
        });

        this.reaction('Rehonor the character')
            .when({
                onStatusTokenMoved: (event: EventPayload<EventName.OnStatusTokenMoved>, context) =>
                    !!event.token && event.token.grantedStatus === CharacterStatus.Honored &&
                    !!event.donor && isFriendlyCharacter(context, event.donor) &&
                    !context.source.bowed,
                onCardDishonored: (event, context) =>
                    event.card.isOrdinary() && isFriendlyCharacter(context, event.card) && !context.source.bowed,
                onStatusTokenDiscarded: (event: EventPayload<EventName.OnStatusTokenDiscarded>, context) =>
                    !context.source.bowed &&
                    !!event.token && event.token.grantedStatus === CharacterStatus.Honored &&
                    (event.cards ?? []).some(isFriendlyCharacter.bind(null, context))
            })
            .gameAction(AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardCondition: (card) => targetsFromEvent(context).has(card),
                subActionProperties: (card: DrawCard) => {
                    context.target = card;
                    return { target: card };
                },
                gameAction: AbilityDsl.actions.honor(),
                message: '{0} honors {1}',
                messageArgs: (card, player) => [player, card]
            })))
            .effect('protect the honor of the Crane');
    }
}
