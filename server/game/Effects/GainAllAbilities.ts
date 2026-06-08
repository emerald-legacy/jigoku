import { EffectValue } from './EffectValue.js';
import GainAbility from './GainAbility.js';
import { AbilityType, Location } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type { CardAction } from '../CardAction.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type { StoredPersistentEffect } from '../BaseCard.js';

interface GainedAbilities {
    actions: unknown[];
    reactions: TriggeredAbility[];
}

export default class GainAllAbilities extends EffectValue<BaseCard> {
    actions: GainAbility[];
    reactions: GainAbility[];
    persistentEffects: StoredPersistentEffect[];
    abilitiesForTargets: Record<string, GainedAbilities>;

    constructor(card: BaseCard) {
        super(card);
        this.actions = card.abilities.actions.map((action: CardAction) => new GainAbility(AbilityType.Action, action));
        //Need to ignore keyword reactions or we double up on the pride / courtesy / sincerity triggers
        this.reactions = card.abilities.reactions
            .filter((a: TriggeredAbility) => !a.isKeywordAbility())
            .map((ability: TriggeredAbility) => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects.map((effect) => Object.assign({}, effect));
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
                return value.getValue() as TriggeredAbility;
            })
        };
        for(const effect of this.persistentEffects) {
            if(effect.location === Location.PlayArea || effect.location === Location.Any) {
                effect.ref = target.addEffectToEngine({ ...effect, location: effect.location });
            }
        }
    }

    unapply(target: BaseCard) {
        if(!this.abilitiesForTargets[target.uuid]) {
            return;
        }
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

    getActions(target: BaseCard): unknown[] {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }
        return [];
    }

    getReactions(target: BaseCard): TriggeredAbility[] {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }
        return [];
    }

    getPersistentEffects(): StoredPersistentEffect[] {
        return this.persistentEffects;
    }
}
