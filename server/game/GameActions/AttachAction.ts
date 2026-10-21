import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

// the controller after attaching is decided when the event is created, before other events of the same window change it
type AttachEvent<Context extends AbilityContext> = ActionEvent<EventName.OnCardAttached, Context> & { parent: BaseCard; newController?: Player };

export interface AttachProperties extends CardActionProperties {
    attachment?: DrawCard;
    ignoreType?: boolean;
    takeControl?: boolean;
    giveControl?: boolean;
    ignoreUniqueness?: boolean;
    viaDisguised?: boolean;
    /** Moves it even where the attachment's own conditions aren't met; the game then discards it (Iuchi Rimei). Never onto a "No attachments" card. */
    evenIfIllegal?: boolean;
}

export class AttachAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<
    AttachProperties,
    EventName.OnCardAttached,
    Context,
    'ignoreType' | 'takeControl' | 'giveControl' | 'ignoreUniqueness' | 'viaDisguised' | 'evenIfIllegal'
> {
    override name = 'attach';
    override restriction = RestrictionType.Attach;
    override eventName = EventName.OnCardAttached;
    override targetType = [CardType.Character, CardType.Province];
    override defaultProperties = {
        ignoreType: false,
        takeControl: false,
        giveControl: false,
        ignoreUniqueness: false,
        viaDisguised: false,
        evenIfIllegal: false
    };

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.takeControl) {
            return ['take control of and attach {2}\'s {1} to {0}', [properties.attachment, properties.attachment?.parent]];
        } else if(properties.giveControl) {
            return ['give control of and attach {2}\'s {1} to {0}', [properties.attachment, properties.attachment?.parent]];
        }
        return ['attach {1} to {0}', [properties.attachment]];
    }

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.viaDisguised) {
            return true;
        }

        const attachment = properties.attachment;
        if(!context.player || (card.location !== Location.PlayArea && card.type !== CardType.Province) || !attachment) {
            return false;
        }
        const controller = this.getFinalController(properties, context) ?? attachment.controller;
        const allowed = card.allowAttachment(attachment);
        const legallyAttached = attachment.canAttach(card, { ignoreType: properties.ignoreType, controller }) &&
            !card.hasCopyOfAttachment(attachment, controller) && allowed;
        if(
            (!properties.ignoreUniqueness && attachment.anotherUniqueInPlay(context.player)) ||
            (!legallyAttached && !properties.evenIfIllegal) ||
            !allowed
        ) {
            return false;
        } else if(properties.takeControl && attachment.controller === context.player) {
            return false;
        } else if(properties.giveControl && attachment.controller !== context.player) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getFinalController(properties: AttachProperties, context: Context): Player | undefined {
        if(properties.takeControl) {
            return context.player;
        } else if(properties.giveControl) {
            return context.player.opponent;
        }

        return properties.attachment?.controller ?? context.player;
    }

    override checkEventCondition(event: AttachEvent<Context>, additionalProperties: Record<string, unknown>): boolean {
        return this.canAffect(event.parent, event.context, additionalProperties);
    }

    override isEventFullyResolved(event: AnyEvent, card: BaseCard, context: Context, additionalProperties: Record<string, unknown>): boolean {
        const { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    override addPropertiesToEvent(event: AttachEvent<Context>, card: BaseCard, context: Context, additionalProperties: Record<string, unknown>): void {
        const properties = this.getProperties(context, additionalProperties);
        event.parent = card;
        if(properties.attachment) {
            event.card = properties.attachment;
        }
        event.context = context;
        if(properties.takeControl) {
            event.newController = context.player;
        } else if(properties.giveControl) {
            event.newController = context.player.opponent;
        }
    }

    override eventHandler(event: AttachEvent<Context>, additionalProperties: ActionOverrides = {}): void {
        const card = event.card;
        const parent = event.parent;
        const context = event.context;
        event.originalLocation = card.location;

        if(card.location === Location.PlayArea && card.parent) {
            card.parent.removeAttachment(card);
        } else {
            if(card.location === Location.PlayArea) {
                context.game.currentConflict?.removeFromConflict(card);
            }
            card.controller.removeCardFromPile(card);
            card.new = true;
            card.moveTo(Location.PlayArea);
        }
        parent.attachments.push(card);
        card.parent = parent;
        if(event.newController) {
            card.controller = event.newController;
            card.updateEffectContexts();
        }
        if(parent.getType() === CardType.Province) {
            this.checkForRefillProvince(parent, event, additionalProperties);
        }
    }
}
