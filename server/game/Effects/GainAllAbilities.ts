import { EffectValue } from './EffectValue.js';
import GainAbility from './GainAbility.js';
import { AbilityTypes, Locations } from '../Constants.js';

export default class GainAllAbilities extends EffectValue<any> {
    actions: GainAbility[];
    reactions: GainAbility[];
    persistentEffects: any[];
    abilitiesForTargets: Record<string, { actions: any[]; reactions: any[] }>;

    constructor(card: any) {
        super(card);
        this.actions = card.abilities.actions.map((action: any) => new GainAbility(AbilityTypes.Action, action));
        //Need to ignore keyword reactions or we double up on the pride / courtesy / sincerity triggers
        this.reactions = card.abilities.reactions
            .filter((a: any) => !a.isKeywordAbility())
            .map((ability: any) => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects.map((effect: any) => Object.assign({}, effect));
        this.abilitiesForTargets = {};
    }

    apply(target: any) {
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map((value) => {
                value.apply(target);
                return value.getValue();
            }),
            reactions: this.reactions.map((value) => {
                value.apply(target);
                return value.getValue();
            })
        };
        for(const effect of this.persistentEffects) {
            if(effect.location === Locations.PlayArea || effect.location === Locations.Any) {
                effect.ref = target.addEffectToEngine(effect);
            }
        }
    }

    unapply(target: any) {
        for(const value of this.abilitiesForTargets[target.uuid].reactions) {
            value.unregisterEvents();
        }
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                delete effect.ref;
            }
        }
        delete this.abilitiesForTargets[target.uuid];
    }

    getActions(target: any): any[] {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }
        return [];
    }

    getReactions(target: any): any[] {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }
        return [];
    }

    getPersistentEffects(): any[] {
        return this.persistentEffects;
    }
}
