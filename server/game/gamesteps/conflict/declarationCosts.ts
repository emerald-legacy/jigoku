import { EffectName } from '../../Constants.js';
import type { Cost } from '../../costs/Cost.js';
import { payHonor } from '../../costs/fateAndHonorCosts.js';
import type DrawCard from '../../DrawCard.js';
import type { Event } from '../../Events/Event.js';
import type { MessageArgs } from '../../GameChat.js';

/** A cost the rules charge to declare a conflict, attackers or defenders, and what the chat says once it is paid. */
export interface DeclarationCost {
    costs: Cost[];
    paidMessages?: (events: Event[]) => MessageArgs[];
}

/** The honor it costs to declare these characters (tainted, Unleashed Experiment). */
export function honorCostToDeclare(characters: DrawCard[]): number {
    return characters.reduce((total, card) =>
        total + card.getEffects(EffectName.HonorCostToDeclare).reduce((sum, effect) => sum + effect.amount, 0), 0);
}

/** One honor cost per effect, so the honor lost to a status token is reported as such. */
export function honorCostsToDeclare(characters: DrawCard[]): Cost[] {
    return characters.flatMap((card) =>
        card.getEffects(EffectName.HonorCostToDeclare).map((effect) => payHonor(effect.amount, effect.dueToStatusToken)));
}
