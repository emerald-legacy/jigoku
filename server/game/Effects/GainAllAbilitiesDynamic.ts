import { EffectValue } from './EffectValue.js';
import GainAbility from './GainAbility.js';
import { AbilityTypes } from '../Constants.js';

// This ignores persistent effects since it's used by Shosuro Deceiver who only takes triggered abilities
export default class GainAllAbilitiesDynamic extends EffectValue<any> {
    match: any;
    createdAbilities: Record<string, GainAbility>;
    abilitiesForTargets: Record<string, { actions: any[]; reactions: any[] }>;
    actions: GainAbility[];
    reactions: GainAbility[];
    persistentEffects: any[];

    constructor(match: any) {
        super(match);
        this.match = match;
        this.createdAbilities = {};
        this.abilitiesForTargets = {};
        this.actions = [];
        this.reactions = [];
        this.persistentEffects = [];
    }

    _setAbilities(cards: any, target: any) {
        if(!Array.isArray(cards)) {
            cards = [cards];
        }

        this.actions = [];
        this.reactions = [];
        this.persistentEffects = [];
        cards.forEach((card: any) => {
            card._getActions(true)
                .filter((a: any) => a.isTriggeredAbility() && (!card.isBlank() || !a.printedAbility))
                .forEach((action: any) => this.actions.push(this.getAbility(AbilityTypes.Action, action, target)));
            card._getReactions(true)
                .filter((a: any) => a.isTriggeredAbility() && (!card.isBlank() || !a.printedAbility))
                .forEach((ability: any) => {
                    this.reactions.push(this.getAbility(ability.abilityType, ability, target));
                });
        });
    }

    getAbilityIdentifier(ability: any): string {
        return `${ability.abilityIdentifier}-${ability.card.uuid}`;
    }

    getAbility(abilityType: string, ability: any, target: any): GainAbility {
        const id = this.getAbilityIdentifier(ability);
        if(!this.createdAbilities[id]) {
            const res = new GainAbility(abilityType, ability);
            this.createdAbilities[id] = res;
            this.createdAbilities[id].apply(target);
        }
        return this.createdAbilities[id];
    }

    calculate(target: any, context: any) {
        let cards: any[] = [];
        if(typeof this.match === 'function') {
            cards = this.match(target, context);
        } else {
            cards = this.match;
        }

        this.unapply(target);
        this._setAbilities(cards, target);
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map((value) => {
                return value.getValue();
            }),
            reactions: this.reactions.map((value) => {
                return value.getValue();
            })
        };
        this._applyAbilities(target);
    }

    _applyAbilities(target: any) {
        if(this.abilitiesForTargets[target.uuid]) {
            for(const value of this.abilitiesForTargets[target.uuid].reactions) {
                value.registerEvents();
            }
        }
    }

    _unapplyAbilities(target: any) {
        this.unapply(target);
    }

    unapply(target: any) {
        if(this.abilitiesForTargets[target.uuid]) {
            for(const value of this.abilitiesForTargets[target.uuid].reactions) {
                value.unregisterEvents();
            }
        }
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
