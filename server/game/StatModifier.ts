import type BaseCard from './BaseCard.js';
import { CardType } from './Constants.js';

interface EffectLike {
    context?: { source?: { name?: string; type?: string } };
}

/** A modifier as the client gets it: a dash (NaN) has no amount, so the client's sum is NaN, not 0. */
export interface StatModifierSummary {
    amount?: number;
    name: string;
    countsAsBase: boolean;
    type: string | undefined;
    overrides: boolean;
}

class StatModifier {
    amount: number;
    name: string;
    countsAsBase: boolean = false;
    type: string | undefined;
    overrides: boolean;

    constructor(amount: number, name: string, overrides: boolean, type?: string) {
        this.amount = amount;
        this.name = name;
        this.overrides = overrides;
        this.type = type;
    }

    toSummary(): StatModifierSummary {
        const summary: StatModifierSummary = { name: this.name, countsAsBase: this.countsAsBase, type: this.type, overrides: this.overrides };
        return isNaN(this.amount) ? summary : { amount: this.amount, ...summary };
    }

    static getEffectName(effect: EffectLike | null | undefined): string {
        if(effect && effect.context && effect.context.source && effect.context.source.name) {
            return effect.context.source.name;
        }
        return 'Unknown';
    }

    static getEffectType(effect: EffectLike | null | undefined): string | undefined {
        if(effect && effect.context && effect.context.source) {
            return effect.context.source.type;
        }
        return undefined;
    }

    static getCardType(card: BaseCard | null | undefined): CardType | undefined {
        if(card) {
            return card.type;
        }
        return undefined;
    }

    static fromEffect(amount: number, effect: EffectLike | null | undefined, overrides = false, name = `${this.getEffectName(effect)}`) {
        return new this(
            amount,
            name,
            overrides,
            this.getEffectType(effect)
        );
    }

    static fromCard(amount: number, card: BaseCard | null | undefined, name: string, overrides = false) {
        return new this(
            amount,
            name,
            overrides,
            this.getCardType(card)
        );
    }

}

export default StatModifier;
