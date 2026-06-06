import type { AbilityContext } from '../AbilityContext.js';
import { Duration, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import Effects from '../effects.js';
import type { WhenType } from '../Interfaces.js';
import type { GameActionProperties } from './GameAction.js';
import { LastingEffectCardAction, type LastingEffectCardProperties } from './LastingEffectCardAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface TakeControlProperties extends GameActionProperties {
    duration?: Duration;
    until?: WhenType;
    effect?: EffectFactory | EffectFactory[] | null;
    targetLocation?: Location | Location[];
}

export class TakeControlAction extends LastingEffectCardAction {
    name = 'takeControl';
    effect = 'take control of {0}';
    defaultProperties: LastingEffectCardProperties = {
        duration: Duration.Custom,
        targetLocation: Location.PlayArea,
        effect: null
    };

    constructor(properties: ((context: AbilityContext) => TakeControlProperties) | TakeControlProperties) {
        super(properties as LastingEffectCardProperties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}) {
        const properties = super.getProperties(context, additionalProperties);
        if(properties.effect.length === 0 || !properties.effect[0]) {
            properties.effect = [Effects.takeControl(context.player)];
        }
        return properties;
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return !card.anotherUniqueInPlay(context.player) && super.canAffect(card, context, additionalProperties);
    }

    eventHandler(event: GameEvent<EventName.OnEffectApplied>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties);
        (event.context as AbilityContext).source.applyDurationEffect(properties.duration ?? Duration.Custom, () => Object.assign({ match: event.card }, properties));
    }
}
