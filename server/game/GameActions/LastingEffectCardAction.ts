import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import { Duration, EffectName, EventName, Location } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import { CardGameAction } from './CardGameAction.js';
import type { LastingEffectGeneralProperties } from './LastingEffectAction.js';

type LastingEffectFactory = (game: unknown, source: unknown, props: unknown) => { effect: { canBeApplied: (card: BaseCard) => boolean; type: string }; match: unknown };

export interface LastingEffectCardProperties extends LastingEffectGeneralProperties {
    targetLocation?: Location | Location[];
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
}

export class LastingEffectCardAction<
    P extends LastingEffectCardProperties = LastingEffectCardProperties
// @ts-expect-error -- P extends LastingEffectCardProperties but CardGameAction expects CardGameActionProperties; intentional for lasting effect specialization
> extends CardGameAction<P> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect to {0}';
    // @ts-expect-error -- intentionally narrowing defaultProperties type from base class generic P to LastingEffectCardProperties
    defaultProperties: LastingEffectCardProperties = {
        duration: Duration.UntilEndOfConflict,
        canChangeZoneOnce: false,
        canChangeZoneNTimes: 0,
        effect: [],
        ability: null as unknown as BaseAbility
    };

    getEffectMessage(context: AbilityContext, additionalProperties = {}): [string, unknown[]] {
        let properties = this.getProperties(context, additionalProperties);
        const message = properties.message || this.effect;

        return [message, [properties.target]];
    }

    // @ts-expect-error -- overriding return type to be more specific than base class signature
    getProperties(context: AbilityContext, additionalProperties = {}): LastingEffectCardProperties {
        let properties = super.getProperties(context, additionalProperties) as LastingEffectCardProperties;
        if(!Array.isArray(properties.effect)) {
            properties.effect = [properties.effect];
        }
        return properties;
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        properties.effect = properties.effect.map((factory: LastingEffectFactory) => factory(context.game, context.source, properties));
        const lastingEffectRestrictions = card.getEffects(EffectName.CannotApplyLastingEffects);
        return (
            super.canAffect(card, context) &&
            properties.effect.some(
                (props: ReturnType<LastingEffectFactory>) =>
                    props.effect.canBeApplied(card) &&
                    !lastingEffectRestrictions.some((condition: (e: unknown) => boolean) => condition(props.effect))
            )
        );
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnEffectApplied>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        const { effect: _effect, ...otherProperties } = this.getProperties(context, additionalProperties);
        const eventContext = event.context as AbilityContext;
        const effectProperties = Object.assign({ match: event.card, location: Location.Any }, otherProperties);
        let effects = _effect.map((factory: LastingEffectFactory) =>
            factory(eventContext.game, eventContext.source, effectProperties)
        );

        event.effectTypes = effects.map((eff: ReturnType<LastingEffectFactory>) => eff.effect.type);
        const matches = effects.map((eff: ReturnType<LastingEffectFactory>) => eff.match);
        event.matches = Array.isArray(matches) ? matches : [matches];
    }

    eventHandler(event: GameEvent<EventName.OnEffectApplied>, additionalProperties: Record<string, unknown> = {}): void {
        const eventContext = event.context as AbilityContext;
        let properties = this.getProperties(eventContext, additionalProperties);
        if(!properties.ability) {
            properties.ability = eventContext.ability;
        }

        const card = event.card as BaseCard;
        const lastingEffectRestrictions = card.getEffects(EffectName.CannotApplyLastingEffects);
        const { effect: _effect, ...otherProperties } = properties;
        const effectProperties = Object.assign({ match: card, location: Location.Any }, otherProperties);
        let effects = properties.effect.map((factory: LastingEffectFactory) =>
            factory(eventContext.game, eventContext.source, effectProperties)
        );
        effects = effects.filter(
            (props: ReturnType<LastingEffectFactory>) =>
                props.effect.canBeApplied(card) &&
                !lastingEffectRestrictions.some((condition: (e: unknown) => boolean) => condition(props.effect))
        );
        for(const effect of effects) {
            eventContext.game.effectEngine.add(effect);
        }
    }
}
