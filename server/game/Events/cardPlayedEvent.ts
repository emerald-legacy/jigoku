import type { AbilityContext } from '../AbilityContext.js';
import { EventName, type PlayType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type AbilityResolver from '../gamesteps/AbilityResolver.js';

/** The OnCardPlayed event for `card`, played by the context's player from where it is now. */
export function createCardPlayedEvent(context: AbilityContext, card: DrawCard, playType: PlayType | undefined, resolver?: AbilityResolver) {
    return context.game.getEvent(EventName.OnCardPlayed, {
        player: context.player,
        card,
        context,
        originalLocation: card.location,
        originallyOnTopOfConflictDeck: context.player && context.player.conflictDeck && context.player.conflictDeck[0] === card,
        onPlayCardSource: context.onPlayCardSource,
        playedFromOutOfPlaySource: card.fromOutOfPlaySource?.slice(),
        playType,
        ...(resolver ? { resolver } : {})
    });
}
