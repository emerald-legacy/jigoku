import { EffectValue } from './EffectValue.js';
import { AbilityType, Location } from '../Constants.js';
import type { Duration } from '../Constants.js';
import type { AbilityLimit } from '../AbilityLimit.js';
import type BaseCard from '../BaseCard.js';
import type CardAbility from '../CardAbility.js';
import type { CardAction } from '../CardAction.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type { TriggeredAbilityProperties } from '../TriggeredAbility.js';
import type Effect from './Effect.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TriggeredAbilityProps
} from '../Interfaces.js';

type TriggeredAbilityType = Exclude<AbilityType, AbilityType.Action | AbilityType.Persistent>;

export type GainedPersistentProps = PersistentEffectProps & { location?: Location };

/** Authored properties, whose kind the ability type decides, or a printed or gained ability to copy. */
export type GainAbilityArgs =
    | [abilityType: AbilityType.Action, ability: ActionProps]
    | [abilityType: AbilityType.Persistent, ability: GainedPersistentProps]
    | [abilityType: TriggeredAbilityType, ability: TriggeredAbilityProps]
    | [abilityType: AbilityType, ability: CardAbility];

interface CopiedProps {
    printedAbility: boolean;
    abilityIdentifier?: string;
    origin?: BaseCard;
    limit?: AbilityLimit;
    max?: AbilityLimit;
}

type PersistentGain = GainedPersistentProps & { printedAbility: boolean; location: Location; abilityType?: AbilityType };

// read back as a stored persistent effect, which has no duration
export type PersistentGainValue = PersistentGain & { ref?: Effect[]; duration?: Duration };

type Grant =
    | { kind: AbilityType.Action; properties: ActionProps }
    | { kind: AbilityType.Persistent; properties: PersistentGain }
    | { kind: 'triggered'; properties: TriggeredAbilityProps }
    | { kind: 'copiedTriggered'; properties: TriggeredAbilityProperties };

export type GainedAbilityValue = boolean | CardAction | TriggeredAbility | PersistentGainValue;

// only a card ability carries its properties; authored properties never have that key
function isCopy(args: GainAbilityArgs): args is [AbilityType, CardAbility] {
    return 'properties' in args[1];
}

function copiedProps(ability: CardAbility): CopiedProps {
    const props: CopiedProps = {
        printedAbility: false,
        abilityIdentifier: ability.abilityIdentifier,
        origin: ability.card
    };
    if(ability.properties.limit) {
        // If the copied ability has a limit, we need to create a new instantiation of it, with the same max and reset event
        props.limit = ability.properties.limit.clone();
    }
    if(ability.properties.max) {
        // Same for max
        props.max = ability.properties.max.clone();
    }
    return props;
}

function grantFor(args: GainAbilityArgs): Grant {
    if(isCopy(args)) {
        const ability = args[1];
        return ability.isCardAction()
            ? { kind: AbilityType.Action, properties: Object.assign({}, ability.properties, copiedProps(ability)) }
            : { kind: 'copiedTriggered', properties: Object.assign({}, ability.properties, copiedProps(ability)) };
    }
    if(args[0] === AbilityType.Action) {
        return { kind: AbilityType.Action, properties: Object.assign({ printedAbility: false }, args[1]) };
    }
    if(args[0] === AbilityType.Persistent) {
        const properties = Object.assign({ printedAbility: false }, args[1]);
        const location = properties.location;
        return {
            kind: AbilityType.Persistent,
            properties: location
                ? Object.assign(properties, { location })
                : Object.assign(properties, { location: Location.PlayArea, abilityType: AbilityType.Persistent })
        };
    }
    return { kind: 'triggered', properties: Object.assign({ printedAbility: false }, args[1]) };
}

export default class GainAbility extends EffectValue<GainedAbilityValue, BaseCard> {
    abilityType: AbilityType;
    createCopies: boolean;
    forCopying: GainAbilityArgs | undefined;
    grantedAbilityLimits: Record<string, AbilityLimit>;
    grant: Grant;
    // the last granted ability by kind; `value` holds the same object
    grantedAction?: CardAction;
    grantedTriggered?: TriggeredAbility;
    grantedPersistent?: PersistentGainValue;

    constructor(...args: GainAbilityArgs) {
        super(true);
        this.abilityType = args[0];
        this.createCopies = false;
        if(args[0] === AbilityType.Persistent && !isCopy(args) && args[1].createCopies) {
            this.createCopies = true;
            this.forCopying = args;
        }
        this.grantedAbilityLimits = {};
        this.grant = grantFor(args);
    }

    getCopy(): GainAbility {
        if(this.createCopies && this.forCopying) {
            const ability = new GainAbility(...this.forCopying);
            ability.context = this.context;
            return ability;
        }
        return this;
    }

    reset() {
        this.grantedAbilityLimits = {};
    }

    copyForTarget(): GainAbility | undefined {
        return this.abilityType === AbilityType.Persistent ? this.getCopy() : undefined;
    }

    apply(target: BaseCard) {
        const origin = { origin: this.context?.source };
        const grant = this.grant;
        if(grant.kind === AbilityType.Persistent) {
            const activeLocations: Record<string, string[]> = {
                'play area': [Location.PlayArea],
                province: this.requireContext().game.getProvinceArray()
            };
            const value: PersistentGainValue = Object.assign(origin, grant.properties);
            this.value = value;
            this.grantedPersistent = value;
            if(activeLocations[value.location].includes(target.location)) {
                value.ref = target.addEffectToEngine(value);
            }
            return;
        }
        let granted: CardAction | TriggeredAbility;
        if(grant.kind === AbilityType.Action) {
            const action = target.createAction(Object.assign(origin, grant.properties));
            this.value = action;
            this.grantedAction = action;
            granted = action;
        } else {
            const triggered = target.createTriggeredAbility(this.abilityType, Object.assign(origin, grant.properties));
            this.value = triggered;
            this.grantedTriggered = triggered;
            triggered.registerEvents();
            granted = triggered;
        }
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
            ].includes(this.abilityType)
        ) {
            this.grantedTriggered?.unregisterEvents();
        } else if(this.abilityType === AbilityType.Persistent) {
            const value = this.grantedPersistent;
            if(value?.ref) {
                target.removeEffectFromEngine(value.ref);
                delete value.ref;
            }
        }
    }
}
