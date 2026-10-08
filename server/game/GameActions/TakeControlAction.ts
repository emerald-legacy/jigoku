import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Duration, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { Effects } from '../effects.js';
import type { EffectUntil } from '../Effects/Effect.js';
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

export class TakeControlAction<C extends AbilityContext = AbilityContext> extends CardLastingEffectAction<C> {
    name = 'takeControl';
    effect = 'take control of {0}';
    defaultProperties = {
        duration: Duration.Custom,
        targetLocation: Location.PlayArea,
        canChangeZoneOnce: false,
        canChangeZoneNTimes: 0
    };

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        if(properties.effect.length === 0) {
            properties.effect = [Effects.takeControl(context.player)];
        }
        return properties;
    }

    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return !card.anotherUniqueInPlay(context.player) && super.canAffect(card, context, additionalProperties);
    }

    eventHandler(event: ActionEvent<EventName.OnEffectApplied, C>, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        event.context.source.applyDurationEffect(properties.duration, Object.assign({ match: event.card }, properties));
    }
}
