import { AbilityContext } from './AbilityContext.js';
import BaseAction from './BaseAction.js';
import { Stage } from './Constants.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';

/**
 * A play action whose source is the card being played — always a `DrawCard`
 * (character/attachment). Narrows `card`/`context.source` to `DrawCard` for the
 * play-action subclasses without making `BaseAction` generic (which would break
 * the invariant `BaseAction[]` ability collections).
 */
export abstract class PlayCardSourceAction extends BaseAction {
    declare card: DrawCard;

    createContext(player: Player = this.card.controller): AbilityContext<DrawCard> {
        return new AbilityContext<DrawCard>({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card,
            stage: Stage.PreTarget
        });
    }
}
