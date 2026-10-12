import type { AbilityContext } from '../AbilityContext.js';
import { DeckType, Location, type EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import type { MessageArgs } from '../GameChat.js';
import type Player from '../Player.js';
import type { ActionOverrides, GameAction } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';

export interface TokenFromTopCardProperties extends PlayerActionProperties {
    deck: DeckType;
    token: new (card: DrawCard) => DrawCard;
    gameAction: (token: DrawCard) => GameAction;
}

/** The top card of the target player's deck (the ability's player by default) becomes a token, then `gameAction(token)` resolves. */
export class TokenFromTopCardAction<C extends AbilityContext = AbilityContext> extends PlayerAction<TokenFromTopCardProperties, EventName.Unnamed, C> {
    name = 'tokenFromTopCard';

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { deck } = this.getProperties(context, additionalProperties);
        return ['turn the top card of {0}\'s {1} deck into a token', [deck]];
    }


    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return this.#deck(player, context, additionalProperties).length > 0 && super.canAffect(player, context, additionalProperties);
    }

    eventHandler(event: PlayerEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const { token: tokenClass, gameAction } = this.getProperties(context, additionalProperties);
        const card = this.#deck(event.player, context, additionalProperties)[0];
        const token = context.game.createToken(card, tokenClass);
        card.owner.removeCardFromPile(card);
        card.moveTo(Location.RemovedFromGame);
        const events: Event[] = [];
        gameAction(token).addEventsToArray(events, context);
        context.game.openThenEventWindow(events);
    }

    #deck(player: Player, context: C, additionalProperties: ActionOverrides): DrawCard[] {
        return this.getProperties(context, additionalProperties).deck === DeckType.Dynasty ? player.dynastyDeck : player.conflictDeck;
    }
}
