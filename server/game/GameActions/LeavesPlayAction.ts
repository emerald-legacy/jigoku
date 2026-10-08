import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { EventName, Location } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import { isEnumValue } from '../utils/helpers.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

/** A leaves-play event this action created: `updateEvent` always sets its destination. */
export type LeavesPlayEvent<C extends AbilityContext> = ActionEvent<EventName.OnCardLeavesPlay, C> & { destination: Location };

export class LeavesPlayAction<
    P extends CardActionProperties = CardActionProperties,
    C extends AbilityContext = AbilityContext,
    D extends keyof P = never
> extends CardGameAction<P, EventName.OnCardLeavesPlay, C, D> {
    eventName = EventName.OnCardLeavesPlay;

    updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown>): void {
        super.updateEvent(event, card, context, additionalProperties);
        const destination = additionalProperties.destination;
        event.isSacrifice = this.name === 'sacrifice';
        event.destination = typeof destination === 'string' && isEnumValue(Location, destination)
            ? destination
            : card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile;
        event.preResolutionEffect = () => {
            const evCard = event.card;
            event.cardStateWhenLeftPlay = evCard.createSnapshot();
            if(evCard.isAncestral() && event.isContingent) {
                event.destination = Location.Hand;
                context.game.addMessage(
                    '{0} returns to {1}\'s hand due to its Ancestral keyword',
                    evCard,
                    evCard.owner
                );
            }
        };
        event.createContingentEvents = () => {
            const contingentEvents: Event[] = [];
            const evCard = event.card;
            // Add an imminent triggering condition for all attachments leaving play

            for(const attachment of evCard.attachments) {
                // we only need to add events for attachments that are in play.
                if(attachment.location === Location.PlayArea) {
                    const attachmentEvent = context.game.actions
                        .discardFromPlay()
                        .getEvent(attachment, context.game.getFrameworkContext());
                    attachmentEvent.order = event.order - 1;
                    const previousCondition = attachmentEvent.condition;
                    attachmentEvent.condition = (attachmentEvent) =>
                        previousCondition(attachmentEvent) && attachment.parent === evCard;
                    attachmentEvent.isContingent = true;
                    contingentEvents.push(attachmentEvent);
                }
            }

            // Add an imminent triggering condition for removing fate
            if(evCard.allowGameAction('removeFate', context.game.getFrameworkContext())) {
                const fateEvent = context.game.actions
                    .removeFate({ amount: evCard.getFate() })
                    .getEvent(evCard, context.game.getFrameworkContext());
                fateEvent.order = event.order - 1;
                fateEvent.isContingent = true;
                contingentEvents.push(fateEvent);
            }
            return contingentEvents;
        };
    }

    eventHandler(event: LeavesPlayEvent<C>, additionalProperties: ActionOverrides = {}): void {
        const card = event.card;
        this.checkForRefillProvince(card, event, additionalProperties);
        if(!card.owner.isLegalLocationForCard(card, event.destination)) {
            card.game.addMessage(
                '{0} is not a legal location for {1} and it is discarded',
                event.destination,
                card
            );
            event.destination = card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile;
        }
        card.owner.moveCard(card, event.destination, event.options || {});
    }
}
