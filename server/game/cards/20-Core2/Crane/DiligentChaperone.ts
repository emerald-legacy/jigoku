import { Locations, CardTypes, CharacterStatus, EventNames } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
function targetsFromEvent(context: AbilityContext): WeakSet<BaseCard> {
    switch((context as TriggeredAbilityContext).event.name) {
        case EventNames.OnStatusTokenMoved:
            return new WeakSet([(context as TriggeredAbilityContext).event.donor as BaseCard]);
        case EventNames.OnCardDishonored:
            return new WeakSet([(context as TriggeredAbilityContext).event.card as BaseCard]);
        case EventNames.OnStatusTokenDiscarded:
            return new WeakSet((context as TriggeredAbilityContext).event.cards);
        default:
            return new WeakSet();
    }
}

function isFriendlyCharacter(context: TriggeredAbilityContext<any>, card: BaseCard) {
    return card.controller === context.player && card.type === CardTypes.Character;
}

export default class DiligentChaperone extends DrawCard {
    static id = 'diligent-chaperone';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            effect: AbilityDsl.effects.cannotParticipateAsAttacker()
        });

        this.reaction({
            title: 'Rehonor the character',
            when: {
                onStatusTokenMoved: (event: EventPayload<EventNames.OnStatusTokenMoved>, context) =>
                    !!event.token && event.token.grantedStatus === CharacterStatus.Honored &&
                    !!event.donor && isFriendlyCharacter(context, event.donor) &&
                    !context.source.bowed,
                onCardDishonored: (event: { card: DrawCard }, context) =>
                    event.card.isOrdinary() && isFriendlyCharacter(context, event.card) && !context.source.bowed,
                onStatusTokenDiscarded: (event: EventPayload<EventNames.OnStatusTokenDiscarded>, context) =>
                    !context.source.bowed &&
                    !!event.token && event.token.grantedStatus === CharacterStatus.Honored &&
                    (event.cards ?? []).some(isFriendlyCharacter.bind(null, context))
            },
            effect: 'protect the honor of the Crane',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardCondition: (card, context: any) => targetsFromEvent(context).has(card),
                subActionProperties: (card) => {
                    context.target = card;
                    return { target: card };
                },
                gameAction: AbilityDsl.actions.honor(),
                message: '{0} honors {1}',
                messageArgs: (card, player) => [player, card]
            }))
        });
    }
}
