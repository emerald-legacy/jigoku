import { Location, CardType, CharacterStatus, EventName } from '../../../Constants.js';
import { cannotParticipateAsAttacker } from '../../../effects.js';
import { honor, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { GameEvent } from '../../../Events/EventPayloads.js';

type ChaperoneEvent = GameEvent<EventName.OnStatusTokenMoved | EventName.OnCardDishonored | EventName.OnStatusTokenDiscarded>;

function targetsFromEvent(event: ChaperoneEvent): WeakSet<BaseCard> {
    switch(event.name) {
        case EventName.OnStatusTokenMoved:
            return new WeakSet(event.donor ? [event.donor] : []);
        case EventName.OnCardDishonored:
            return new WeakSet([event.card]);
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
            effect: cannotParticipateAsAttacker()
        });

        this.reaction('Rehonor the character')
            .when({
                onStatusTokenMoved: (event, context) =>
                    event.token.grantedStatus === CharacterStatus.Honored &&
                    !!event.donor && isFriendlyCharacter(context, event.donor) &&
                    !context.source.bowed,
                onCardDishonored: (event, context) =>
                    event.card.isOrdinary() && isFriendlyCharacter(context, event.card) && !context.source.bowed,
                onStatusTokenDiscarded: (event, context) =>
                    !context.source.bowed &&
                    event.token.grantedStatus === CharacterStatus.Honored &&
                    event.cards.some(isFriendlyCharacter.bind(null, context))
            })
            .gameAction(selectCard((context) => ({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardCondition: (card) => targetsFromEvent(context.event).has(card),
                gameAction: honor(),
                message: '{0} honors {1}',
                messageArgs: (card, player) => [player, card]
            })))
            .effect('protect the honor of the Crane');
    }
}
