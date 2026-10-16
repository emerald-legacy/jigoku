import { msg, type MessageArgs } from '../GameChat.js';
import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EffectName, EventName, Location, RestrictionType } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import { isEnumValue } from '../utils/helpers.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { RemoveFateAction } from './RemoveFateAction.js';

/** A leaves-play event this action created: `updateEvent` always sets its destination. */
export type LeavesPlayEvent<Context extends AbilityContext> = ActionEvent<EventName.OnCardLeavesPlay, Context> & { destination: Location };

export class LeavesPlayAction<
    Properties extends CardActionProperties = CardActionProperties,
    Context extends AbilityContext = AbilityContext,
    Defaulted extends keyof Properties = never
> extends CardGameAction<Properties, EventName.OnCardLeavesPlay, Context, Defaulted> {
    override eventName = EventName.OnCardLeavesPlay;
    isSacrifice = false;

    override updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, Context>, card: DrawCard, context: Context, additionalProperties: Record<string, unknown>): void {
        super.updateEvent(event, card, context, additionalProperties);
        const destination = additionalProperties.destination;
        event.isSacrifice = this.isSacrifice;
        event.destination = typeof destination === 'string' && isEnumValue(Location, destination)
            ? destination
            : card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile;
        event.preResolutionEffect = () => {
            const evCard = event.card;
            event.cardStateWhenLeftPlay = evCard.createSnapshot();
            if(evCard.isAncestral() && event.isContingent) {
                event.destination = Location.Hand;
                context.game.addMessage(msg`${evCard} returns to ${evCard.owner}'s hand due to its Ancestral keyword`);
            }
            const removal = evCard.mostRecentEffect(EffectName.RemoveFromGameInsteadOfLeavingPlay);
            if(removal) {
                event.destination = Location.RemovedFromGame;
                if(removal.message) {
                    context.game.addMessage(removal.message(evCard));
                }
            }
        };
        event.createContingentEvents = () => {
            const contingentEvents: Event[] = [];
            const evCard = event.card;
            // Add an imminent triggering condition for all attachments leaving play

            for(const attachment of evCard.attachments) {
                // we only need to add events for attachments that are in play.
                if(attachment.location === Location.PlayArea) {
                    const attachmentEvent = new DiscardFromPlayAction({})
                        .getEvent(attachment, context.game.getGameContext());
                    attachmentEvent.order = event.order - 1;
                    const previousCondition = attachmentEvent.condition;
                    attachmentEvent.condition = (attachmentEvent) =>
                        previousCondition(attachmentEvent) && attachment.parent === evCard;
                    attachmentEvent.isContingent = true;
                    contingentEvents.push(attachmentEvent);
                }
            }

            // Add an imminent triggering condition for removing fate
            if(evCard.allowGameAction('removeFate', context.game.getGameContext())) {
                const fateEvent = new RemoveFateAction({ amount: evCard.getFate() })
                    .getEvent(evCard, context.game.getGameContext());
                fateEvent.order = event.order - 1;
                fateEvent.isContingent = true;
                contingentEvents.push(fateEvent);
            }
            return contingentEvents;
        };
    }

    override eventHandler(event: LeavesPlayEvent<Context>, additionalProperties: ActionOverrides = {}): void {
        const card = event.card;
        this.checkForRefillProvince(card, event, additionalProperties);
        if(!card.owner.isLegalLocationForCard(card, event.destination)) {
            card.game.addMessage(msg`${event.destination} is not a legal location for ${card} and it is discarded`);
            event.destination = card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile;
        }
        card.owner.moveCard(card, event.destination, event.options || {});
    }
}

// next to LeavesPlayAction, which discards attachments with it: in a module of its own, each would import the other
export type DiscardFromPlayProperties = CardActionProperties;

export class DiscardFromPlayAction<Context extends AbilityContext = AbilityContext> extends LeavesPlayAction<DiscardFromPlayProperties, Context> {
    override name = 'discardFromPlay';
    override restriction = RestrictionType.DiscardFromPlay;
    override cost = 'sacrificing {0}';
    override targetType = [CardType.Character, CardType.Attachment, CardType.Holding];

    constructor(propertyFactory: DiscardFromPlayProperties | ((context: Context) => DiscardFromPlayProperties), isSacrifice = false) {
        super(propertyFactory);
        if(isSacrifice) {
            this.name = 'sacrifice';
            this.restriction = RestrictionType.Sacrifice;
            this.isSacrifice = true;
        }
    }

    protected override effectMessage(): MessageArgs {
        return [this.isSacrifice ? 'sacrifice {0}' : 'discard {0}', []];
    }

    override canAffect(card: BaseCard, context: Context): boolean {
        if(card.type === CardType.Holding) {
            if(this.isSacrifice && card.facedown) {
                return false;
            }
            if(!card.isInProvince()) {
                return false;
            }
        } else if(card.location !== Location.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }
}
