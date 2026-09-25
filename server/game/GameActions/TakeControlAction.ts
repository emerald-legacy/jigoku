import type { AbilityContext } from '../AbilityContext.js';
import { Duration, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import Effects from '../effects.js';
import type { WhenType } from '../Interfaces.js';
import type { CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { LastingEffectCardAction, type LastingEffectCardProperties } from './LastingEffectCardAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';

export interface TakeControlProperties extends CardActionProperties {
    duration?: Duration;
    until?: WhenType;
    effect?: EffectFactory | EffectFactory[];
    targetLocation?: Location | Location[];
}

export class TakeControlAction<C extends AbilityContext = AbilityContext> extends LastingEffectCardAction<C> {
    name = 'takeControl';
    effect = 'take control of {0}';
    defaultProperties: Partial<LastingEffectCardProperties> = {
        duration: Duration.Custom,
        targetLocation: Location.PlayArea
    };

    constructor(properties: ((context: C) => TakeControlProperties) | TakeControlProperties) {
        super(properties);
    }

    getProperties(context: C, additionalProperties = {}) {
        const properties = super.getProperties(context, additionalProperties);
        if(properties.effect.length === 0 || !properties.effect[0]) {
            properties.effect = [Effects.takeControl(context.player)];
        }
        return properties;
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        return !card.anotherUniqueInPlay(context.player) && super.canAffect(card, context, additionalProperties);
    }

    eventHandler(event: ActionEvent<EventName.OnEffectApplied, C>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context), additionalProperties);
        (event.context).source.applyDurationEffect(properties.duration ?? Duration.Custom, () => Object.assign({ match: event.card }, properties));
    }
}
