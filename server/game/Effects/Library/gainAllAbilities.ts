import type BaseCard from '../../basecard.js';
import { AbilityTypes, EffectNames, Locations } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { EffectValue } from '../EffectValue.js';
import GainAbility from '../GainAbility.js';

export class GainAllAbilities extends EffectValue<BaseCard> {
    actions: Array<GainAbility>;
    reactions: Array<GainAbility>;
    persistentEffects: Array<any>;
    abilitiesForTargets: Record<string, undefined | { actions: Array<GainAbility>; reactions: Array<GainAbility> }>;
    printedOnly: boolean;

    constructor(card: BaseCard, printedOnly = false) {
        super(card);
        this.printedOnly = printedOnly;
        this.actions = card.abilities.actions
            .filter(action => !this.printedOnly || action.printedAbility)
            .map((action) => new GainAbility(AbilityTypes.Action, action));
        //Need to ignore keyword reactions or we double up on the pride / courtesy / sincerity triggers
        this.reactions = card.abilities.reactions
            .filter(a => !this.printedOnly || a.printedAbility)
            .filter((a) => !a.isKeywordAbility())
            .map((ability) => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects
            // .filter(a => !this.printedOnly || a.printedAbility)
            .map((effect) => Object.assign({}, effect));
        this.abilitiesForTargets = {};
    }

    apply(target: BaseCard) {
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

    unapply(target: BaseCard) {
        for(const value of this.abilitiesForTargets[target.uuid].reactions) {
            // @ts-expect-error -- GainAbility values have unregisterEvents at runtime but the type is not declared
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

    getActions(target: BaseCard) {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }
        return [];
    }

    getReactions(target: BaseCard) {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }
        return [];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}

export function gainAllAbilities(character: BaseCard, printedOnly: boolean = false) {
    return EffectBuilder.card.static(EffectNames.GainAllAbilities, new GainAllAbilities(character, printedOnly));
}
