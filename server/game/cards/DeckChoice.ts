import type { AbilityContext } from '../AbilityContext.js';
import { DeckType, Players } from '../Constants.js';
import { msg, type MsgArg } from '../GameChat.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';

export interface DeckChoiceOptions {
    /** Whose piles: the ability's player's, their opponent's, or both. */
    players: Players.Self | Players.Opponent | Players.Any;
    pile: 'deck' | 'discard pile';
}

interface Pile {
    label: string;
    name: string;
    player: Player;
    deck: DeckType;
    cards: DrawCard[];
}

/**
 * A choice of a player's dynasty or conflict deck (or discard pile), as `selectFrom` choices labelled
 * "player2's Conflict Deck". An empty pile isn't offered.
 */
export class DeckChoice {
    constructor(private readonly options: DeckChoiceOptions) {}

    choices<A>(action: (player: Player, deck: DeckType) => A): (context: AbilityContext) => Record<string, A> {
        return (context) => Object.fromEntries(
            this.#piles(context)
                .filter((pile) => pile.cards.length > 0)
                .map((pile) => [pile.label, action(pile.player, pile.deck)])
        );
    }

    /** The chosen pile, for chat: "player2's conflict deck". */
    chosenName(context: AbilityContext, select = context.select): MsgArg {
        const pile = this.#piles(context).find((candidate) => candidate.label === select);
        return pile ? context.game.gameChat.nested(msg`${pile.player}'s ${pile.name}`) : undefined;
    }

    #piles(context: AbilityContext): Pile[] {
        const players = [
            ...(this.options.players !== Players.Opponent ? [context.player] : []),
            ...(this.options.players !== Players.Self && context.player.opponent ? [context.player.opponent] : [])
        ];
        const discard = this.options.pile === 'discard pile';
        const pile = (player: Player, deck: DeckType, type: string, cards: DrawCard[]): Pile => ({
            label: `${player.name}'s ${type} ${discard ? 'Discard Pile' : 'Deck'}`,
            name: `${type.toLowerCase()} ${this.options.pile}`,
            player,
            deck,
            cards
        });
        return players.flatMap((player) => [
            pile(player, DeckType.Dynasty, 'Dynasty', discard ? player.dynastyDiscardPile : player.dynastyDeck),
            pile(player, DeckType.Conflict, 'Conflict', discard ? player.conflictDiscardPile : player.conflictDeck)
        ]);
    }
}
