import { EffectName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';

/** Whether a character's military and political skills can be switched: not a dash (RRG Dash) and not set by an effect (EmeraldDB rulings). */
export function canSwitchSkills(card: DrawCard): boolean {
    return !card.hasDash() && !card.anyEffect(EffectName.SetMilitarySkill) && !card.anyEffect(EffectName.SetPoliticalSkill);
}
