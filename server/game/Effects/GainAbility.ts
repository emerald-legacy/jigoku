import { EffectValue } from './EffectValue.js';
import { AbilityTypes, Locations } from '../Constants.js';
import type { AbilityLimit } from '../AbilityLimit.js';
import type BaseCard from '../BaseCard.js';

export default class GainAbility extends EffectValue<any> {
    abilityType: AbilityTypes;
    createCopies: boolean;
    forCopying: { abilityType: AbilityTypes; ability: any } | undefined;
    grantedAbilityLimits: Record<string, AbilityLimit>;
    properties: any;

    constructor(abilityType: AbilityTypes, ability: any) {
        super(true);
        this.abilityType = abilityType;
        this.createCopies = false;
        if(ability.createCopies) {
            this.createCopies = true;
            this.forCopying = { abilityType: abilityType, ability: ability };
        }
        this.grantedAbilityLimits = {};
        if(ability.properties) {
            let newProps: any = {
                printedAbility: false,
                abilityIdentifier: ability.abilityIdentifier,
                origin: ability.card
            };
            if(ability.properties.limit) {
                // If the copied ability has a limit, we need to create a new instantiation of it, with the same max and reset event
                newProps.limit = ability.properties.limit.clone();
            }
            if(ability.properties.max) {
                // Same for max
                newProps.max = ability.properties.max.clone();
            }
            this.properties = Object.assign({}, ability.properties, newProps);
        } else {
            this.properties = Object.assign({ printedAbility: false }, ability);
        }
        if(abilityType === AbilityTypes.Persistent && !this.properties.location) {
            this.properties.location = Locations.PlayArea;
            this.properties.abilityType = AbilityTypes.Persistent;
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
        let properties = Object.assign({ origin: this.context.source }, this.properties);
        if(this.abilityType === AbilityTypes.Persistent) {
            const activeLocations: Record<string, string[]> = {
                'play area': [Locations.PlayArea],
                province: this.context.game.getProvinceArray()
            };
            this.value = properties;
            if(activeLocations[this.value.location].includes(target.location)) {
                this.value.ref = target.addEffectToEngine(this.value);
            }
            return;
        } else if(this.abilityType === AbilityTypes.Action) {
            this.value = target.createAction(properties);
        } else {
            this.value = target.createTriggeredAbility(this.abilityType as AbilityTypes, properties);
            this.value.registerEvents();
        }
        if(!this.grantedAbilityLimits[target.uuid]) {
            this.grantedAbilityLimits[target.uuid] = this.value.limit;
        } else {
            this.value.limit = this.grantedAbilityLimits[target.uuid];
        }
        this.grantedAbilityLimits[target.uuid].currentUser = target.uuid;
    }

    unapply(target: BaseCard) {
        if(this.grantedAbilityLimits[target.uuid]) {
            this.grantedAbilityLimits[target.uuid].currentUser = null;
        }
        if(
            [
                AbilityTypes.ForcedInterrupt,
                AbilityTypes.ForcedReaction,
                AbilityTypes.Interrupt,
                AbilityTypes.Reaction,
                AbilityTypes.WouldInterrupt
            ].includes(this.abilityType as AbilityTypes)
        ) {
            this.value.unregisterEvents();
        } else if(this.abilityType === AbilityTypes.Persistent && this.value.ref) {
            target.removeEffectFromEngine(this.value.ref);
            delete this.value.ref;
        }
    }
}
