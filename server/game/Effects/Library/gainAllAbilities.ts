import type BaseCard from '../../BaseCard.js';
import type { CardAction } from '../../CardAction.js';
import type TriggeredAbility from '../../TriggeredAbility.js';
import { AbilityType, EffectName, Location } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { EffectValue } from '../EffectValue.js';
import GainAbility from '../GainAbility.js';

export class GainAllAbilities extends EffectValue<BaseCard> {
    actions: Array<GainAbility>;
    reactions: Array<GainAbility>;
    persistentEffects: Array<any>;
    abilitiesForTargets: Record<string, undefined | { actions: CardAction[]; reactions: TriggeredAbility[] }>;
    printedOnly: boolean;

    constructor(card: BaseCard, printedOnly = false) {
        super(card);
        this.printedOnly = printedOnly;
        this.actions = card.abilities.actions
            .filter((action: CardAction) => !this.printedOnly || action.printedAbility)
            .map((action: CardAction) => new GainAbility(AbilityType.Action, action));
        //Need to ignore keyword reactions or we double up on the pride / courtesy / sincerity triggers
        this.reactions = card.abilities.reactions
            .filter((a: TriggeredAbility) => !this.printedOnly || a.printedAbility)
            .filter((a: TriggeredAbility) => !a.isKeywordAbility())
            .map((ability: TriggeredAbility) => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects
            // .filter(a => !this.printedOnly || a.printedAbility)
            .map((effect) => Object.assign({}, effect));
        this.abilitiesForTargets = {};
    }

    apply(target: BaseCard) {
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map((value) => {
                value.apply(target);
                return value.getValue() as CardAction;
            }),
            reactions: this.reactions.map((value) => {
                value.apply(target);
                return value.getValue() as TriggeredAbility;
            })
        };
        for(const effect of this.persistentEffects) {
            if(effect.location === Location.PlayArea || effect.location === Location.Any) {
                effect.ref = target.addEffectToEngine(effect);
            }
        }
    }

    unapply(target: BaseCard) {
        const entry = this.abilitiesForTargets[target.uuid];
        if(entry) {
            for(const value of entry.reactions) {
                value.unregisterEvents();
            }
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
        const entry = this.abilitiesForTargets[target.uuid];
        if(entry) {
            return entry.actions;
        }
        return [];
    }

    getReactions(target: BaseCard) {
        const entry = this.abilitiesForTargets[target.uuid];
        if(entry) {
            return entry.reactions;
        }
        return [];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}

export function gainAllAbilities(character: BaseCard, printedOnly: boolean = false) {
    return EffectBuilder.card.static(EffectName.GainAllAbilities, new GainAllAbilities(character, printedOnly));
}
