import type BaseCard from '../../BaseCard.js';
import { AbilityTypes, Locations, CardTypes, EffectNames } from '../../Constants.js';
import type { CardAction } from '../../CardAction.js';
import type TriggeredAbility from '../../TriggeredAbility.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { EffectValue } from '../EffectValue.js';
import GainAbility from '../GainAbility.js';

class CopyCard extends EffectValue<BaseCard> {
    actions: Array<GainAbility>;
    reactions: Array<GainAbility>;
    persistentEffects: Array<any>;
    abilitiesForTargets = new WeakMap<
        BaseCard,
        {
            actions: Array<GainAbility>;
            reactions: Array<GainAbility>;
        }
    >();

    constructor(card: BaseCard) {
        super(card);
        this.actions = card.abilities.actions.map((action: CardAction) => new GainAbility(AbilityTypes.Action, action));
        this.reactions = card.abilities.reactions.map(
            (ability: TriggeredAbility) => new GainAbility(ability.abilityType, ability)
        );
        this.persistentEffects = card.abilities.persistentEffects.map((effect) => Object.assign({}, effect));
    }

    apply(target: BaseCard) {
        this.abilitiesForTargets.set(target, {
            actions: this.actions.map((value) => {
                value.apply(target);
                return value.getValue();
            }),
            reactions: this.reactions.map((value) => {
                value.apply(target);
                return value.getValue();
            })
        });
        for(const effect of this.persistentEffects) {
            if(
                effect.location === Locations.Any ||
                (target.getType() === CardTypes.Character && effect.location === Locations.PlayArea) ||
                (target.getType() === CardTypes.Holding && effect.location === Locations.Provinces)
            ) {
                effect.ref = target.addEffectToEngine(effect);
            }
        }
    }

    unapply(target: BaseCard) {
        for(const value of this.abilitiesForTargets.get(target)?.reactions ?? []) {
            // @ts-expect-error -- GainAbility values have unregisterEvents at runtime but the type is not declared
            value.unregisterEvents();
        }
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                delete effect.ref;
            }
        }
        this.abilitiesForTargets.delete(target);
    }

    getActions(target: BaseCard) {
        return this.abilitiesForTargets.get(target)?.actions ?? [];
    }

    getReactions(target: BaseCard) {
        const copied = this.abilitiesForTargets.get(target)?.reactions ?? [];
        const ownKeywordReactions = target.abilities.reactions.filter(
            (ability) => typeof ability.isKeywordAbility === 'function' && ability.isKeywordAbility()
        );
        return [...copied, ...ownKeywordReactions];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}

export function copyCard(character: BaseCard) {
    return EffectBuilder.card.static(EffectNames.CopyCharacter, new CopyCard(character));
}
