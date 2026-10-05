import type { AbilityContext } from '../AbilityContext.js';
import { createCard } from '../Deck.js';
import DrawCard from '../DrawCard.js';
import type { EffectArg } from '../Interfaces.js';
import { article } from './article.js';

/** A new copy of a creature from outside the game, added to the game's cards so it can be put into play. */
export function createSummonedCopy(context: AbilityContext, creature: DrawCard): DrawCard {
    const copy = createCard(context.player, creature.cardData, DrawCard);
    context.game.allCards.push(copy);
    return copy;
}

/** The effect message of summoning a creature, with `summonEffectArgs` as its args. */
export const summonEffectMessage = 'summon {2} {1} from the depths of the Shadowlands!';

/** The args of `summonEffectMessage`. */
export function summonEffectArgs(creature: DrawCard | undefined): EffectArg[] {
    return [creature, article(creature?.name ?? '')];
}
