import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Duration, type EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { takeControl } from '../Effects/Library/takeControl.js';
import type { EffectUntil } from '../Effects/ActiveEffect.js';
import type { CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { CardLastingEffectAction } from './CardLastingEffectAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';
import type { TargetLocation } from '../Interfaces.js';

export interface TakeControlProperties extends CardActionProperties {
    duration?: Duration;
    until?: EffectUntil;
    effect?: EffectFactory | EffectFactory[];
    targetLocation?: TargetLocation;
}

export class TakeControlAction<Context extends AbilityContext = AbilityContext> extends CardLastingEffectAction<Context> {
    override name = 'takeControl';
    override restriction = RestrictionType.TakeControl;
    override effect = 'take control of {0}';
    override defaultProperties = {
        duration: Duration.Custom,
        targetLocation: Location.PlayArea,
        canChangeZoneOnce: false,
        canChangeZoneNTimes: 0
    };

    override getProperties(context: Context, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        if(properties.effect.length === 0) {
            properties.effect = [takeControl(context.player)];
        }
        return properties;
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        return !card.anotherUniqueInPlay(context.player) && super.canAffect(card, context, additionalProperties);
    }

    override eventHandler(event: ActionEvent<EventName.OnEffectApplied, Context>, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        event.context.source.applyDurationEffect(properties.duration, Object.assign({ match: event.card }, properties));
    }
}
