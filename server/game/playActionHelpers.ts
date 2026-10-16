import type { AbilityContext } from './AbilityContext.js';
import { Blocker, EffectName, RestrictionType, type PlayType } from './Constants.js';
import type DrawCard from './DrawCard.js';

/** The fate a character enters play with besides what the player chose: extra fate and legendary fate. */
export function getExtraFateWhenPlayed(card: DrawCard, context: AbilityContext): number {
    const extraFate = card.checkRestrictions(RestrictionType.PlaceFate, context) ? card.sumEffects(EffectName.GainExtraFateWhenPlayed) : 0;
    return extraFate + card.sumEffects(EffectName.LegendaryFate);
}

/** What stops the card being played from where it is: the wrong location, a play restriction or a unique already in play. */
export function getPlayBlocker(card: DrawCard, context: AbilityContext, ignoredBlockers: Blocker[], playType: PlayType | undefined): Blocker | undefined {
    if(!ignoredBlockers.includes(Blocker.WrongLocation) && !context.player.isCardInPlayableLocation(card, playType)) {
        return Blocker.WrongLocation;
    }
    if(!ignoredBlockers.includes(Blocker.CannotTrigger) && !card.canPlay(context, playType)) {
        return Blocker.CannotTrigger;
    }
    return card.anotherUniqueInPlay(context.player) ? Blocker.DuplicateUnique : undefined;
}
