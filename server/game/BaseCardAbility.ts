import { AbilityContext } from './AbilityContext.js';
import BaseAbility from './BaseAbility.js';
import { Stage } from './Constants.js';
import type Player from './Player.js';
import type BaseCard from './BaseCard.js';
import type Game from './Game.js';

/**
 * An ability whose source is a card (play actions, card actions, reactions),
 * as opposed to source-agnostic abilities like the elemental ring effects.
 * Owns the card-bound contract — the source `card` and `createContext` — so the
 * card action/play/reaction menus share one type instead of falling back to `any`.
 */
abstract class BaseCardAbility extends BaseAbility {
    card: BaseCard;
    title?: string;

    constructor(card: BaseCard, properties: ConstructorParameters<typeof BaseAbility>[0]) {
        super(properties);
        this.card = card;
    }

    get game(): Game {
        return this.card.game;
    }

    createContext(player: Player = this.card.controller): AbilityContext {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card,
            stage: Stage.PreTarget
        });
    }
}

export default BaseCardAbility;
