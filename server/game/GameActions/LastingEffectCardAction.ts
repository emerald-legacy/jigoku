import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { Duration, EffectName, EventName, Location } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { toEffectList, type LastingEffectFields } from './LastingEffectAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';
import type Effect from '../Effects/Effect.js';

export interface LastingEffectCardProperties extends CardActionProperties, LastingEffectFields {
    targetLocation?: Location | Location[];
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
}

export class LastingEffectCardAction<C extends AbilityContext = AbilityContext> extends CardGameAction<LastingEffectCardProperties, EventName, C> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect to {0}';
    defaultProperties: Partial<LastingEffectCardProperties> = {
        duration: Duration.UntilEndOfConflict,
        canChangeZoneOnce: false,
        canChangeZoneNTimes: 0
    };

    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        let properties = this.getProperties(context, additionalProperties);
        const message = properties.message || this.effect;

        return [message, [properties.target]];
    }

    getProperties(context: C, additionalProperties = {}): LastingEffectCardProperties & { effect: EffectFactory[] } {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    canAffect(card: BaseCard, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        const effects = properties.effect.map((factory) => factory(context.game, context.source, properties));
        const lastingEffectRestrictions = card.getEffects(EffectName.CannotApplyLastingEffects);
        return (
            super.canAffect(card, context) &&
            effects.some(
                (props: Effect) =>
                    props.effect.canBeApplied(card) &&
                    !lastingEffectRestrictions.some((condition: (e: unknown) => boolean) => condition(props.effect))
            )
        );
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnEffectApplied, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        const { effect: _effect, ...otherProperties } = this.getProperties(context, additionalProperties);
        const eventContext = event.context;
        const effectProperties = Object.assign({ match: event.card, location: Location.Any }, otherProperties);
        let effects = _effect.map((factory) =>
            factory(eventContext.game, eventContext.source, effectProperties)
        );

        event.effectTypes = effects.map((eff) => eff.effect.type);
        const matches = effects.map((eff) => eff.match);
        event.matches = Array.isArray(matches) ? matches : [matches];
    }

    eventHandler(event: ActionEvent<EventName.OnEffectApplied, C>, additionalProperties: Record<string, unknown> = {}): void {
        const eventContext = event.context;
        let properties = this.getProperties(eventContext, additionalProperties);
        if(!properties.ability) {
            properties.ability = eventContext.ability;
        }

        const card = event.card as BaseCard;
        const lastingEffectRestrictions = card.getEffects(EffectName.CannotApplyLastingEffects);
        const { effect: _effect, ...otherProperties } = properties;
        const effectProperties = Object.assign({ match: card, location: Location.Any }, otherProperties);
        let effects = properties.effect.map((factory) =>
            factory(eventContext.game, eventContext.source, effectProperties)
        );
        effects = effects.filter(
            (props: Effect) =>
                props.effect.canBeApplied(card) &&
                !lastingEffectRestrictions.some((condition: (e: unknown) => boolean) => condition(props.effect))
        );
        for(const effect of effects) {
            eventContext.game.effectEngine.add(effect);
        }
    }
}
