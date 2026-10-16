import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { Duration, EffectName, EventName, Location } from '../Constants.js';
import { CardGameAction, type CardActionProperties, type CardEvent } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { toEffectList, type LastingEffectFields } from './LastingEffectAction.js';
import type { TargetLocation } from '../Interfaces.js';

export interface LastingEffectCardProperties<Context extends AbilityContext = AbilityContext> extends CardActionProperties, LastingEffectFields<Context> {
    targetLocation?: TargetLocation;
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
    /** The ability's chat text for this effect, after "to"; without it, "apply a lasting effect to <target>". */
    chatText?(context: Context): MessageArgs;
}

export class CardLastingEffectAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<
    LastingEffectCardProperties,
    EventName.OnEffectApplied,
    Context,
    'duration' | 'canChangeZoneOnce' | 'canChangeZoneNTimes'
> {
    override name = 'cardLastingEffect';
    override eventName = EventName.OnEffectApplied;
    override effect = 'apply a lasting effect to {0}';
    override defaultProperties = {
        duration: Duration.UntilEndOfConflict,
        canChangeZoneOnce: false,
        canChangeZoneNTimes: 0
    };

    override getEffectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { chatText } = this.getProperties(context, additionalProperties);
        return chatText ? chatText(context) : super.getEffectMessage(context, additionalProperties);
    }

    override getProperties(context: Context, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const effects = properties.effect.map((factory) => factory(context.game, context.source, properties));
        const lastingEffectRestrictions = card.getEffects(EffectName.CannotApplyLastingEffects);
        return (
            super.canAffect(card, context) &&
            effects.some(
                (props) =>
                    props.effect.canBeApplied(card) &&
                    !lastingEffectRestrictions.some((condition) => condition(props.effect))
            )
        );
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnEffectApplied, Context>, card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        const { effect, ...otherProperties } = this.getProperties(context, additionalProperties);
        const eventContext = event.context;
        const effectProperties = Object.assign({ match: event.card, location: Location.Any }, otherProperties);
        const effects = effect.map((factory) =>
            factory(eventContext.game, eventContext.source, effectProperties)
        );

        event.effectTypes = effects.map((eff) => eff.effect.type);
        event.matches = effects.map((eff) => eff.match);
    }

    override eventHandler(event: CardEvent<EventName.OnEffectApplied, Context>, additionalProperties: ActionOverrides = {}): void {
        const eventContext = event.context;
        const properties = this.getProperties(eventContext, additionalProperties);
        if(!properties.ability) {
            properties.ability = eventContext.ability;
        }

        const card = event.card;
        const lastingEffectRestrictions = card.getEffects(EffectName.CannotApplyLastingEffects);
        const { effect: _effect, ...otherProperties } = properties;
        const effectProperties = Object.assign({ match: card, location: Location.Any }, otherProperties);
        let effects = properties.effect.map((factory) =>
            factory(eventContext.game, eventContext.source, effectProperties)
        );
        effects = effects.filter(
            (props) =>
                props.effect.canBeApplied(card) &&
                !lastingEffectRestrictions.some((condition) => condition(props.effect))
        );
        for(const effect of effects) {
            eventContext.game.effectEngine.add(effect);
        }
    }
}
