import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { DeckType, EventName, Location, RemainingCards, TargetMode } from '../Constants.js';
import { shuffle } from '../utils/random.js';
import type DrawCard from '../DrawCard.js';
import type { GameAction, ActionEvent, WithDefaults } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type Player from '../Player.js';
import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import { derive, type Derivable } from '../utils/helpers.js';
import { RearrangeDeckAction } from './RearrangeDeckAction.js';

export interface DeckSearchProperties<C extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    mode?: TargetMode;
    activePromptTitle?: string;
    cardsToLookAt?: Derivable<number, AbilityContext>;
    numCards?: Derivable<number, AbilityContext>;
    reveal?: boolean;
    deck?: DeckType;
    /** What happens to the looked-at cards not taken, once the taken ones are dealt with; `remainingCardsHandler` replaces it. */
    remainingCards?: Derivable<RemainingCards, AbilityContext>;
    gameAction?: GameAction;
    /** The chat line once cards are taken; without it, "<chooser> takes <cards>". */
    message?: (context: C, cards: DrawCard[], chooser: Player) => MessageArgs;
    uniqueNames?: boolean;
    player?: Player;
    choosingPlayer?: Player;
    selectedCardsHandler?: (context: AbilityContext, event: GameEvent<EventName.OnDeckSearch>, cards: DrawCard[]) => void;
    remainingCardsHandler?: (context: AbilityContext, event: GameEvent<EventName.OnDeckSearch>, cards: DrawCard[]) => void;
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    takesNothingGameAction?: GameAction;
    /** The button that ends the choice; by default "Take nothing", or "Done" once a card is taken. */
    doneButtonText?: string;
}

type DeckSearchDefaults =
    | 'cardsToLookAt'
    | 'numCards'
    | 'mode'
    | 'deck'
    | 'remainingCards'
    | 'reveal'
    | 'uniqueNames'
    | 'cardCondition';

type ResolvedDeckSearchProperties<C extends AbilityContext> = WithDefaults<DeckSearchProperties<C>, DeckSearchDefaults>;

export class DeckSearchAction<C extends AbilityContext = AbilityContext> extends PlayerAction<DeckSearchProperties<C>, EventName.OnDeckSearch, C, DeckSearchDefaults> {
    name = 'deckSearch';
    eventName = EventName.OnDeckSearch;

    defaultProperties = {
        cardsToLookAt: -1,
        numCards: 1,
        mode: TargetMode.Single,
        deck: DeckType.Conflict,
        remainingCards: RemainingCards.Shuffle,
        reveal: true,
        uniqueNames: false,
        cardCondition: () => true
    };

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(derive(properties.cardsToLookAt, context) === 0) {
            return false;
        }
        const player = properties.player || context.player;
        return this.#getDeck(player, properties).length > 0 && super.canAffect(player, context);
    }

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { cardsToLookAt, player } = this.getProperties(context, additionalProperties);
        const amount = derive(cardsToLookAt, context);
        // another player's deck is named
        const deck = player && player !== context.player ? '{1}\'s deck' : 'their deck';
        const message = amount > 0 ? `look at the top ${amount === 1 ? 'card' : `${amount} cards`} of ${deck}` : `search ${deck}`;
        return [message, player && player !== context.player ? [player] : []];
    }

    protected effectMessageTarget(): MsgArg {
        return undefined;
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const amount = derive(properties.cardsToLookAt, context);
        return amount !== 0 && this.#getDeck(player, properties).length > 0 && super.canAffect(player, context);
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnDeckSearch, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { cardsToLookAt } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = derive(cardsToLookAt, context);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const player = properties.player || context.player;
        const event = this.getEvent(player, context, additionalProperties);
        const amount = event.amount > -1 ? event.amount : this.#getDeck(player, properties).length;
        let cards = this.#getDeck(player, properties).slice(0, amount);
        if(event.amount === -1) {
            cards = cards.filter((card) => properties.cardCondition(card, context));
        }
        events.push(event);
        this.#selectCard(event, additionalProperties, cards, new Set());
    }

    #getDeck(player: Player, properties: ResolvedDeckSearchProperties<C>): DrawCard[] {
        switch(properties.deck) {
            case DeckType.Dynasty:
                return player.dynastyDeck.slice();
            case DeckType.Conflict:
                return player.conflictDeck.slice();
            default:
                return [];
        }
    }

    #selectCard(event: ActionEvent<EventName.OnDeckSearch, C>, additionalProperties: ActionOverrides = {}, cards: DrawCard[], selectedCards: Set<DrawCard>): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        const canCancel = properties.mode !== TargetMode.Exactly;
        let selectAmount = 1;
        const choosingPlayer = properties.choosingPlayer || event.player;

        if(properties.mode === TargetMode.UpTo || properties.mode === TargetMode.UpToVariable) {
            selectAmount = derive(properties.numCards, context);
        }
        if(properties.mode === TargetMode.Single) {
            selectAmount = 1;
        }
        if(properties.mode === TargetMode.Exactly || properties.mode === TargetMode.ExactlyVariable) {
            selectAmount = derive(properties.numCards, context);
        }
        if(properties.mode === TargetMode.Unlimited) {
            selectAmount = -1;
        }

        let title = properties.activePromptTitle;
        if(!properties.activePromptTitle) {
            title = 'Select a card' + (properties.reveal ? ' to reveal' : '');
            if(selectAmount < 0 || selectAmount > 1) {
                title =
                    `Select ${selectAmount < 0 ? 'all' : 'up to ' + selectAmount} cards` +
                    (properties.reveal ? ' to reveal' : '');
            }
        }

        if(derive(properties.remainingCards, context) === RemainingCards.Shuffle) {
            cards.sort((a, b) => a.name.localeCompare(b.name));
        }

        context.game.promptWithHandlerMenu(choosingPlayer, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardCondition: (card) =>
                properties.cardCondition(card, context) &&
                (!properties.uniqueNames || !Array.from(selectedCards).some((sel) => sel.name === card.name)) &&
                (!properties.gameAction || properties.gameAction.canAffect(card, context, additionalProperties)),
            options: canCancel ? [{ text: properties.doneButtonText ?? (selectedCards.size > 0 ? 'Done' : 'Take nothing'), handler: () => this.#handleDone(properties, context, event, selectedCards, cards) }] : [],
            cardHandler: (card: DrawCard) => {
                const newSelectedCards = new Set(selectedCards);
                newSelectedCards.add(card);
                const index = cards.indexOf(card, 0);
                if(index > -1) {
                    cards.splice(index, 1);
                }
                if((selectAmount < 0 || newSelectedCards.size < selectAmount) && cards.length > 0) {
                    this.#selectCard(event, additionalProperties, cards, newSelectedCards);
                } else {
                    this.#handleDone(properties, context, event, newSelectedCards, cards);
                }
            }
        });
    }

    #handleDone(
        properties: ResolvedDeckSearchProperties<C>,
        context: C,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>,
        allCards: DrawCard[]
    ): void {
        event.selectedCards = Array.from(selectedCards);
        context.deckSearchSelected = Array.from(selectedCards);
        const remaining = allCards.filter((card) => !selectedCards.has(card));
        const handleRemaining = () => properties.remainingCardsHandler
            ? properties.remainingCardsHandler(context, event, remaining)
            : this.#handleRemaining(properties, context, event, remaining);
        if(!properties.selectedCardsHandler) {
            this.#defaultHandleDone(properties, context, event, selectedCards);
            handleRemaining();
            return;
        }
        properties.selectedCardsHandler(context, event, Array.from(selectedCards));
        // after any prompt the handler opened to place the taken cards
        context.game.queueSimpleStep(() => {
            handleRemaining();
            return true;
        });
    }

    #handleRemaining(
        properties: ResolvedDeckSearchProperties<C>,
        context: C,
        event: GameEvent<EventName.OnDeckSearch>,
        remaining: DrawCard[]
    ): void {
        const player = event.player;
        const isDynasty = properties.deck === DeckType.Dynasty;
        switch(derive(properties.remainingCards, context)) {
            case RemainingCards.Shuffle:
                return isDynasty ? player.shuffleDynastyDeck() : player.shuffleConflictDeck();
            case RemainingCards.Discard:
                if(remaining.length > 0) {
                    context.game.addMessage(msg`${player} discards ${remaining}`);
                    for(const card of remaining) {
                        player.moveCard(card, isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
                    }
                }
                return;
            case RemainingCards.TopAnyOrder:
                if(remaining.length > 1) {
                    new RearrangeDeckAction({ cards: remaining, deck: properties.deck }).resolve(player, context);
                }
                return;
            case RemainingCards.BottomRandom:
                if(remaining.length > 0) {
                    for(const card of shuffle(remaining)) {
                        player.moveCard(card, isDynasty ? Location.DynastyDeck : Location.ConflictDeck, { bottom: true });
                    }
                    context.game.addMessage(msg`${player} puts ${remaining.length} card${remaining.length > 1 ? 's' : ''} on the bottom of their ${isDynasty ? 'dynasty' : 'conflict'} deck`);
                }
                return;
            case RemainingCards.Top:
                return;
        }
    }

    #defaultHandleDone(
        properties: ResolvedDeckSearchProperties<C>,
        context: C,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>
    ): void {
        this.#doneMessage(properties, context, event, selectedCards);

        const gameAction = this.getProperties(context).gameAction;
        if(gameAction) {
            const selectedArray = Array.from(selectedCards);
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, { target: selectedArray })) {
                    gameAction.resolve(selectedArray, context);
                }
                return true;
            });
        }
    }

    #doneMessage(
        properties: ResolvedDeckSearchProperties<C>,
        context: C,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>
    ): void {
        const choosingPlayer = (properties.choosingPlayer || event.player);
        if(selectedCards.size > 0 && properties.message) {
            return context.game.addMessage(properties.message(context, Array.from(selectedCards), choosingPlayer));
        }

        if(selectedCards.size === 0) {
            return this.#takesNothing(properties, context, event);
        }

        if(properties.reveal) {
            return context.game.addMessage(msg`${choosingPlayer} takes ${Array.from(selectedCards)}`);
        }

        context.game.addMessage(msg`${choosingPlayer} takes ${selectedCards.size} ${selectedCards.size > 1 ? 'cards' : 'card'}`);
    }

    #takesNothing(properties: ResolvedDeckSearchProperties<C>, context: C, event: GameEvent<EventName.OnDeckSearch>): void {
        const choosingPlayer = (properties.choosingPlayer || event.player);
        context.game.addMessage(msg`${choosingPlayer} takes nothing`);
        if(properties.takesNothingGameAction) {
            const action = properties.takesNothingGameAction;
            context.game.queueSimpleStep(() => {
                if(action.hasLegalTarget(context)) {
                    action.resolve(undefined, context);
                }
                return true;
            });
        }
    }
}
