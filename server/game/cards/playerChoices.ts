import type { GameAction } from '../GameActions/GameAction.js';
import type Player from '../Player.js';

/** Choices labelled with the players' names, `player` first; with `both`, also '<player> and <opponent>'. */
export function playerChoices(player: Player, choice: (player: Player) => GameAction, both?: (player: Player, opponent: Player) => GameAction): Record<string, GameAction> {
    const choices: Record<string, GameAction> = { [player.name]: choice(player) };
    const opponent = player.opponent;
    if(opponent) {
        choices[opponent.name] = choice(opponent);
        if(both) {
            choices[`${player.name} and ${opponent.name}`] = both(player, opponent);
        }
    }
    return choices;
}
