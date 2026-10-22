import type { AbilityContext } from '../AbilityContext.js';
import { createCard } from '../Deck.js';
import DrawCard from '../DrawCard.js';
import { msg, type MessageArgs } from '../GameChat.js';
import { article } from './article.js';

/** A new copy of a creature from outside the game, added to the game's cards so it can be put into play. */
export function createSummonedCopy(context: AbilityContext, creature: DrawCard): DrawCard {
    const copy = createCard(context.player, creature.cardData, DrawCard);
    context.game.allCards.push(copy);
    return copy;
}

export function summonChatText(creature: DrawCard | undefined): MessageArgs {
    return msg`summon ${article(creature?.name ?? '')} ${creature} from the depths of the Shadowlands!`;
}
