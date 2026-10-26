import type BaseCard from '../BaseCard.js';
import type { CardAbility } from '../CardAbility.js';
import type { StoredPersistentEffect } from '../BaseCard.js';
import type { CardAction } from '../CardAction.js';
import type { TriggeredAbility } from '../TriggeredAbility.js';
import { AbilityType } from '../Constants.js';
import { EffectValue } from './EffectValue.js';
import { GainAbility, gainedPersistentEffect } from './GainAbility.js';

/**
 * Another card's abilities carried by the cards this applies to (copyCard, gainPrintedAbilities): its actions and
 * reactions, without keyword reactions (the target's own keywords trigger those), and its persistent effects.
 */
export abstract class CarriedAbilities<Card extends BaseCard> extends EffectValue<Card, BaseCard> {
    actions: GainAbility[];
    reactions: GainAbility[];
    persistentEffects: StoredPersistentEffect[];
    private abilitiesForTargets = new Map<string, { actions: CardAction[]; reactions: TriggeredAbility[] }>();

    constructor(card: Card) {
        super(card);
        this.actions = card.abilities.actions
            .filter((action) => this.carries(action))
            .map((action) => new GainAbility(AbilityType.Action, action));
        this.reactions = card.abilities.reactions
            .filter((ability) => this.carries(ability) && !ability.isKeywordAbility())
            .map((ability) => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects.map(gainedPersistentEffect);
    }

    /** Whether an action or triggered ability of the card is carried; persistent effects always are. */
    protected carries(_ability: CardAbility): boolean {
        return true;
    }

    /** Whether a carried persistent effect works on `target` (its location fits the target). */
    protected abstract persistentEffectApplies(effect: StoredPersistentEffect, target: BaseCard): boolean;

    override apply(target: BaseCard) {
        this.abilitiesForTargets.set(target.uuid, {
            actions: this.actions.flatMap((value) => {
                value.apply(target);
                return value.grantedAction ?? [];
            }),
            reactions: this.reactions.flatMap((value) => {
                value.apply(target);
                return value.grantedTriggered ?? [];
            })
        });
        for(const effect of this.persistentEffects) {
            if(this.persistentEffectApplies(effect, target)) {
                effect.ref = target.addEffectToEngine(effect);
            }
        }
    }

    override unapply(target: BaseCard) {
        for(const value of this.abilitiesForTargets.get(target.uuid)?.reactions ?? []) {
            value.unregisterEvents();
        }
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                delete effect.ref;
            }
        }
        this.abilitiesForTargets.delete(target.uuid);
    }

    getActions(target: BaseCard): CardAction[] {
        return this.abilitiesForTargets.get(target.uuid)?.actions ?? [];
    }

    getReactions(target: BaseCard): TriggeredAbility[] {
        return this.abilitiesForTargets.get(target.uuid)?.reactions ?? [];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}
