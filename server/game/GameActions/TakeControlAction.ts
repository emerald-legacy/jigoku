import type { AbilityContext } from '../AbilityContext.js';
import { Durations, Locations } from '../Constants.js';
import type DrawCard from '../drawcard.js';
import Effects from '../effects.js';
import type { WhenType } from '../Interfaces.js';
import type { GameActionProperties } from './GameAction.js';
import { LastingEffectCardAction, type LastingEffectCardProperties } from './LastingEffectCardAction.js';

import type { Event } from '../Events/Event.js';
export interface TakeControlProperties extends GameActionProperties {
    duration?: Durations;
    until?: WhenType;
    effect?: any;
    targetLocation?: Locations | Locations[];
}

export class TakeControlAction extends LastingEffectCardAction {
    name = 'takeControl';
    effect = 'take control of {0}';
    defaultProperties: LastingEffectCardProperties = {
        duration: Durations.Custom,
        targetLocation: Locations.PlayArea,
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

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties);
        (event.context as AbilityContext).source[properties.duration ?? Durations.Custom](() => Object.assign({ match: event.card }, properties));
    }
}
