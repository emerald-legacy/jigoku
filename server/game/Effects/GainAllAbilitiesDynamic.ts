import { EffectValue } from './EffectValue.js';
import { GainAbility } from './GainAbility.js';
import { AbilityType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { StoredPersistentEffect } from '../BaseCard.js';
import type { CardAbility } from '../CardAbility.js';
import type { CardAction } from '../CardAction.js';
import type { TriggeredAbility } from '../TriggeredAbility.js';

export type DynamicMatch = ((target: BaseCard, context: AbilityContext) => BaseCard | BaseCard[]) | BaseCard | BaseCard[];

interface GainedAbilities {
    actions: CardAction[];
    reactions: TriggeredAbility[];
}

/**
 * The triggered abilities of the matched cards (Shosuro Deceiver, Laughing Thunder; persistent effects aren't taken).
 * The match is recalculated on every read of the target's abilities.
 */
export class GainAllAbilitiesDynamic extends EffectValue<DynamicMatch, BaseCard> {
    /** Per target uuid: the gained abilities, by gained ability id, kept so used limits carry over between reads. */
    private readonly createdAbilities = new Map<string, Map<string, GainAbility>>();
    private readonly abilitiesForTargets = new Map<string, GainedAbilities>();

    constructor(private readonly match: DynamicMatch, private readonly printedAbilitiesOnly = false) {
        super(match);
    }

    // a new effect is a new instance of the card (it entered play again) or a copy: no memory of used limits
    override copyForEffect(): GainAllAbilitiesDynamic {
        return new GainAllAbilitiesDynamic(this.match, this.printedAbilitiesOnly);
    }

    calculate(target: BaseCard, context: AbilityContext) {
        const matched = typeof this.match === 'function' ? this.match(target, context) : this.match;

        this.unapply(target);
        const actions: CardAction[] = [];
        const reactions: TriggeredAbility[] = [];
        for(const card of Array.isArray(matched) ? matched : [matched]) {
            for(const action of card.getCardActions(true).filter((ability) => this.isGained(card, ability))) {
                const granted = this.gainedAbility(AbilityType.Action, action, target).grantedAction;
                if(granted) {
                    actions.push(granted);
                }
            }
            for(const reaction of card.getReactions(true).filter((ability) => this.isGained(card, ability))) {
                const granted = this.gainedAbility(reaction.abilityType, reaction, target).grantedTriggered;
                if(granted) {
                    reactions.push(granted);
                }
            }
        }
        this.abilitiesForTargets.set(target.uuid, { actions, reactions });
        for(const reaction of reactions) {
            reaction.registerEvents();
        }
    }

    private isGained(card: BaseCard, ability: CardAbility): boolean {
        return ability.isTriggeredAbility() && (!card.isBlank() || (!this.printedAbilitiesOnly && !ability.printedAbility));
    }

    private gainedAbility(abilityType: AbilityType, ability: CardAbility, target: BaseCard): GainAbility {
        let created = this.createdAbilities.get(target.uuid);
        if(!created) {
            created = new Map();
            this.createdAbilities.set(target.uuid, created);
        }
        const id = `${ability.abilityIdentifier}-${ability.card.uuid}`;
        let gained = created.get(id);
        if(!gained) {
            gained = new GainAbility(abilityType, ability);
            created.set(id, gained);
            gained.apply(target);
        }
        return gained;
    }

    override unapply(target: BaseCard) {
        for(const reaction of this.abilitiesForTargets.get(target.uuid)?.reactions ?? []) {
            reaction.unregisterEvents();
        }
    }

    getActions(target: BaseCard): CardAction[] {
        return this.abilitiesForTargets.get(target.uuid)?.actions ?? [];
    }

    getReactions(target: BaseCard): TriggeredAbility[] {
        return this.abilitiesForTargets.get(target.uuid)?.reactions ?? [];
    }

    getPersistentEffects(): StoredPersistentEffect[] {
        return [];
    }
}
