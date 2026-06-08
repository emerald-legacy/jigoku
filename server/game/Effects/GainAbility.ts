import { EffectValue } from './EffectValue.js';
import { AbilityType, Location } from '../Constants.js';
import type { AbilityLimit } from '../AbilityLimit.js';
import type BaseCard from '../BaseCard.js';
import type CardAbility from '../CardAbility.js';
import type { CardAction } from '../CardAction.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type Effect from './Effect.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps
} from '../Interfaces.js';

type GainAbilityProps =
    | ActionProps
    | TriggeredAbilityProps
    | TriggeredAbilityWhenProps
    | PersistentEffectProps;

interface GainAbilitySource {
    createCopies?: boolean;
    properties?: ActionProps | TriggeredAbilityProps;
    abilityIdentifier?: string;
    card?: BaseCard;
}

interface GainAbilityNewProps {
    printedAbility: boolean;
    abilityIdentifier?: string;
    origin?: BaseCard;
    limit?: AbilityLimit;
    max?: AbilityLimit;
}

type GainAbilityInput = CardAbility | GainAbilityProps;

interface PersistentGainValue {
    location: Location;
    ref?: Effect[];
    abilityType?: AbilityType;
    effect?: PersistentEffectProps['effect'];
}

type GainedAbilityValue = boolean | CardAction | TriggeredAbility | PersistentGainValue;

export default class GainAbility extends EffectValue<GainedAbilityValue> {
    abilityType: AbilityType;
    createCopies: boolean;
    forCopying: { abilityType: AbilityType; ability: GainAbilityInput } | undefined;
    grantedAbilityLimits: Record<string, AbilityLimit>;
    properties: PersistentGainValue | GainAbilityProps;

    constructor(abilityType: AbilityType, ability: GainAbilityInput) {
        super(true);
        this.abilityType = abilityType;
        this.createCopies = false;
        const source = ability as GainAbilitySource;
        if(source.createCopies) {
            this.createCopies = true;
            this.forCopying = { abilityType: abilityType, ability: ability };
        }
        this.grantedAbilityLimits = {};
        if(source.properties) {
            let newProps: GainAbilityNewProps = {
                printedAbility: false,
                abilityIdentifier: source.abilityIdentifier,
                origin: source.card
            };
            if(source.properties.limit) {
                // If the copied ability has a limit, we need to create a new instantiation of it, with the same max and reset event
                newProps.limit = source.properties.limit.clone();
            }
            if(source.properties.max) {
                // Same for max
                newProps.max = source.properties.max.clone();
            }
            this.properties = Object.assign({}, source.properties, newProps);
        } else {
            this.properties = Object.assign({ printedAbility: false }, ability) as GainAbilityProps;
        }
        const props = this.properties as PersistentGainValue;
        if(abilityType === AbilityType.Persistent && !props.location) {
            props.location = Location.PlayArea;
            props.abilityType = AbilityType.Persistent;
        }
    }

    getCopy(): GainAbility {
        if(this.createCopies && this.forCopying) {
            const ability = new GainAbility(this.forCopying.abilityType, this.forCopying.ability);
            ability.context = this.context;
            return ability;
        }
        return this;
    }

    reset() {
        this.grantedAbilityLimits = {};
    }

    apply(target: BaseCard) {
        const origin = { origin: this.context.source };
        if(this.abilityType === AbilityType.Persistent) {
            const activeLocations: Record<string, string[]> = {
                'play area': [Location.PlayArea],
                province: this.context.game.getProvinceArray()
            };
            const value = Object.assign(origin, this.properties as PersistentGainValue);
            this.value = value;
            if(activeLocations[value.location].includes(target.location)) {
                value.ref = target.addEffectToEngine(value);
            }
            return;
        }
        const properties = Object.assign(origin, this.properties);
        if(this.abilityType === AbilityType.Action) {
            this.value = target.createAction(properties as ActionProps);
        } else {
            const triggered = target.createTriggeredAbility(this.abilityType as AbilityType, properties as TriggeredAbilityWhenProps);
            this.value = triggered;
            triggered.registerEvents();
        }
        const granted = this.value as CardAction | TriggeredAbility;
        if(!this.grantedAbilityLimits[target.uuid]) {
            this.grantedAbilityLimits[target.uuid] = granted.limit;
        } else {
            granted.limit = this.grantedAbilityLimits[target.uuid];
        }
        this.grantedAbilityLimits[target.uuid].currentUser = target.uuid;
    }

    unapply(target: BaseCard) {
        if(this.grantedAbilityLimits[target.uuid]) {
            this.grantedAbilityLimits[target.uuid].currentUser = null;
        }
        if(
            [
                AbilityType.ForcedInterrupt,
                AbilityType.ForcedReaction,
                AbilityType.Interrupt,
                AbilityType.Reaction,
                AbilityType.WouldInterrupt
            ].includes(this.abilityType as AbilityType)
        ) {
            (this.value as TriggeredAbility).unregisterEvents();
        } else if(this.abilityType === AbilityType.Persistent) {
            const value = this.value as PersistentGainValue;
            if(value.ref) {
                target.removeEffectFromEngine(value.ref);
                delete value.ref;
            }
        }
    }
}
