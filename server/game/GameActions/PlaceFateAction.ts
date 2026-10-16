import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface PlaceFateProperties extends CardActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<PlaceFateProperties, EventName.OnMoveFate, Context, 'amount'> {
    override name = 'placeFate';
    override restriction = RestrictionType.PlaceFate;
    override eventName = EventName.OnMoveFate;
    override targetType = [CardType.Character];
    override defaultProperties = { amount: 1 };
    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['place {1} fate on {0}', [this.getProperties(context, additionalProperties).amount]];
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        if(amount === 0 || card.location !== Location.PlayArea) {
            return false;
        }

        if(origin instanceof Ring && !context.player.checkRestrictions(RestrictionType.TakeFateFromRings, context)) {
            return false;
        }

        return super.canAffect(card, context) && this.checkOrigin(context, origin) && card !== origin;
    }

    checkOrigin(context: Context, origin?: Player | Ring | DrawCard): boolean {
        if(!origin) {
            return true;
        }

        return (
            origin.fate > 0 &&
            (origin.type === 'player' || origin.type === 'ring' || origin.allowGameAction('removeFate', context))
        );
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, Context>, card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        event.fate = amount;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    override checkEventCondition(event: ActionEvent<EventName.OnMoveFate, Context>): boolean {
        return this.moveFateEventCondition(event);
    }

    override isEventFullyResolved(event: AnyEvent, card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === origin &&
            event.recipient === card
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveFate, Context>): void {
        this.moveFateEventHandler(event);
    }
}
