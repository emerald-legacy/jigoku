import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { DeckType, EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import type { MessageArgs } from '../GameChat.js';
import type Player from '../Player.js';
import { derive, type Derivable } from '../utils/helpers.js';
import { targetList } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';

const ORDINALS = ['first', 'second', 'third'];

export interface RearrangeDeckProperties extends PlayerActionProperties {
    /** How many cards from the top of the deck. */
    amount: Derivable<number, AbilityContext>;
    deck?: DeckType;
    /** The title of the first prompt; the later ones ask for the second, third… card. */
    activePromptTitle?: string;
    /** Printed once the cards are back, with the cards top card first. Method syntax, so a narrower context fits. */
    message?(cards: DrawCard[], context: AbilityContext): MessageArgs;
}

/** The player of the ability puts the top cards of the target player's deck back in the order they choose. */
export class RearrangeDeckAction<C extends AbilityContext = AbilityContext> extends PlayerAction<RearrangeDeckProperties, EventName.Unnamed, C, 'deck' | 'activePromptTitle'> {
    name = 'rearrangeDeck';
    defaultProperties = {
        deck: DeckType.Conflict,
        activePromptTitle: 'Which card do you want to be on top?'
    };

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    protected effectMessage(context: C): MessageArgs {
        const { amount, deck } = this.getProperties(context);
        return ['rearrange the top {1} cards of {0}\'s {2}', [derive(amount, context), deck]];
    }

    #deck(player: Player, deck: DeckType): DrawCard[] {
        return deck === DeckType.Dynasty ? player.dynastyDeck : player.conflictDeck;
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { deck } = this.getProperties(context, additionalProperties);
        return this.#deck(player, deck).length > 0 && super.canAffect(player, context);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        for(const player of targetList(properties.target)) {
            if(!this.canAffect(player, context, additionalProperties)) {
                continue;
            }
            const cards = this.#deck(player, properties.deck).slice(0, derive(properties.amount, context));
            this.#chooseNext(context, cards, [], properties.activePromptTitle, (ordered) => {
                const event = Object.assign(this.getEvent(player, context, additionalProperties), { player });
                event.replaceHandler(() => this.#putBack(event, ordered, additionalProperties));
                events.push(event);
            });
        }
    }

    #chooseNext(context: C, remaining: DrawCard[], ordered: DrawCard[], title: string, done: (ordered: DrawCard[]) => void): void {
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: title,
            context,
            cards: remaining,
            cardHandler: (card) => {
                const chosen = [...ordered, card];
                const rest = remaining.filter((other) => other !== card);
                if(rest.length > 1) {
                    this.#chooseNext(context, rest, chosen, `Which card do you want to be the ${ORDINALS[chosen.length]} card?`, done);
                    return;
                }
                done([...chosen, ...rest]);
            }
        });
    }

    #putBack(event: PlayerEvent<EventName.Unnamed, C>, ordered: DrawCard[], additionalProperties: ActionOverrides = {}): void {
        const { deck, message } = this.getProperties(event.context, additionalProperties);
        this.#deck(event.player, deck).splice(0, ordered.length, ...ordered);
        if(message) {
            const [format, args] = message(ordered, event.context);
            event.context.game.addMessage(format, ...args);
        }
    }
}
