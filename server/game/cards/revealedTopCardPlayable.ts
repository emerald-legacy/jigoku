import type BaseCard from '../BaseCard.js';
import { DeckType, Duration, Location } from '../Constants.js';
import { canPlayFromOwn, showTopConflictCard } from '../effects.js';
import type { PlayerLastingEffectInput } from '../GameActions/LastingEffectAction.js';
import type Player from '../Player.js';

/** `player` reveals the top card of their conflict deck and may play it as if it were in hand, until it leaves the deck or the deck is shuffled, or at the end of the phase or conflict. */
export function revealedTopCardPlayable(player: Player, source: BaseCard, endsWith: 'phase' | 'conflict'): PlayerLastingEffectInput {
    const topCard = player.conflictDeck[0];
    return {
        target: player,
        duration: Duration.Custom,
        until: {
            onCardMoved: (event) => event.card === topCard && event.originalLocation === Location.ConflictDeck,
            onDeckShuffled: (event) => event.player === player && event.deck === DeckType.Conflict,
            ...(endsWith === 'phase' ? { onPhaseEnded: () => true } : { onConflictFinished: () => true })
        },
        effect: [
            showTopConflictCard(),
            canPlayFromOwn(Location.ConflictDeck, [topCard], source)
        ]
    };
}
