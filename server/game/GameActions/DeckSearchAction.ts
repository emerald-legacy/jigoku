import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { DeckType, EventName, Location, RemainingCards, TargetMode } from '../Constants.js';
import { shuffle } from '../utils/random.js';
import type DrawCard from '../DrawCard.js';
import { targetList, type GameAction, type ActionEvent, type WithDefaults } from './GameAction.js';
import { isChosenByAbilityPlayer, resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type Player from '../Player.js';
import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import { derive, type Derivable } from '../utils/helpers.js';
import { RearrangeDeckAction } from './RearrangeDeckAction.js';
import { chooseBlindly, isBlindChoice } from './blindChoice.js';

export interface DeckSearchProperties<Context extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    mode?: TargetMode;
    activePromptTitle?: string;
    cardsToLookAt?: Derivable<number, Context>;
    numCards?: Derivable<number, Context>;
    reveal?: boolean;
    deck?: DeckType;
    /** What happens to the looked-at cards not taken, once the taken ones are dealt with; `remainingCardsHandler` replaces it. */
    remainingCards?: Derivable<RemainingCards, Context>;
    gameAction?: GameAction;
    /** The chat line once cards are taken; without it, "<chooser> takes <cards>". */
    message?(context: Context, cards: DrawCard[], chooser: Player): MessageArgs;
    uniqueNames?: boolean;
    /** Who chooses the cards; by default the player whose deck is searched. */
    player?: Chooser;
    selectedCardsHandler?(context: Context, event: GameEvent<EventName.OnDeckSearch>, cards: DrawCard[]): void;
    remainingCardsHandler?(context: Context, event: GameEvent<EventName.OnDeckSearch>, cards: DrawCard[]): void;
    cardCondition?(card: DrawCard, context: Context): boolean;
    /** The card is chosen ("choose"), so Hantei XXXVIII may make the choice; he can't see the cards, so he chooses none. */
    targets?: boolean;
    takesNothingGameAction?: GameAction;
    /** The button that ends the choice; by default "Take nothing", or "Done" once a card is taken. */
    doneButtonText?: string;
    /** No prompt while none of the looked-at cards can be taken. */
    hideIfNoLegalTargets?: boolean;
    /** Replaces "<chooser> takes nothing"; `undefined` for no chat line. */
    takesNothingMessage?(context: Context, chooser: Player): MessageArgs | undefined;
}

type DeckSearchDefaults =
    | 'cardsToLookAt'
    | 'numCards'
    | 'mode'
    | 'deck'
    | 'remainingCards'
    | 'reveal'
    | 'uniqueNames';

type ResolvedDeckSearchProperties<Context extends AbilityContext> = WithDefaults<DeckSearchProperties<Context>, DeckSearchDefaults>;

export class DeckSearchAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<DeckSearchProperties<Context>, EventName.OnDeckSearch, Context, DeckSearchDefaults> {
    override name = 'deckSearch';
    override eventName = EventName.OnDeckSearch;

    override defaultProperties = {
        cardsToLookAt: -1,
        numCards: 1,
        mode: TargetMode.Single,
        deck: DeckType.Conflict,
        remainingCards: RemainingCards.Shuffle,
        reveal: true,
        uniqueNames: false
    };

    override hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(derive(properties.cardsToLookAt, context) === 0) {
            return false;
        }
        const player = this.#searched(properties, context);
        return this.#getDeck(player, properties).length > 0 && super.canAffect(player, context);
    }

    override hasTargetsChosenByInitiatingPlayer(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return !!properties.targets && isChosenByAbilityPlayer(context, properties.player);
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        const { cardsToLookAt } = properties;
        const player = this.#searched(properties, context);
        const amount = derive(cardsToLookAt, context);
        const deck = player !== context.player ? '{1}\'s deck' : 'their deck';
        const message = amount > 0 ? `look at the top ${amount === 1 ? 'card' : `${amount} cards`} of ${deck}` : `search ${deck}`;
        return [message, player !== context.player ? [player] : []];
    }

    protected override effectMessageTarget(): MsgArg {
        return undefined;
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const amount = derive(properties.cardsToLookAt, context);
        return amount !== 0 && this.#getDeck(player, properties).length > 0 && super.canAffect(player, context);
    }


    override addPropertiesToEvent(event: ActionEvent<EventName.OnDeckSearch, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { cardsToLookAt } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = derive(cardsToLookAt, context);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const player = this.#searched(properties, context);
        const event = this.getEvent(player, context, additionalProperties);
        const amount = event.amount > -1 ? event.amount : this.#getDeck(player, properties).length;
        let cards = this.#getDeck(player, properties).slice(0, amount);
        if(event.amount === -1) {
            cards = cards.filter((card) => !properties.cardCondition || properties.cardCondition(card, context));
        }
        events.push(event);
        this.#selectCard(event, additionalProperties, cards, new Set());
    }

    #searched(properties: ResolvedDeckSearchProperties<Context>, context: Context): Player {
        return targetList(properties.target)[0] ?? context.player;
    }

    #chooser(properties: ResolvedDeckSearchProperties<Context>, event: GameEvent<EventName.OnDeckSearch>): Player {
        return (properties.player && resolveChoosingPlayer(event.context, properties.player)) || event.player;
    }

    #getDeck(player: Player, properties: ResolvedDeckSearchProperties<Context>): DrawCard[] {
        switch(properties.deck) {
            case DeckType.Dynasty:
                return player.dynastyDeck.slice();
            case DeckType.Conflict:
                return player.conflictDeck.slice();
            default:
                return [];
        }
    }

    #selectCard(event: ActionEvent<EventName.OnDeckSearch, Context>, additionalProperties: ActionOverrides = {}, cards: DrawCard[], selectedCards: Set<DrawCard>): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        const canCancel = properties.mode !== TargetMode.Exactly;
        let selectAmount = 1;
        const choosingPlayer = this.#chooser(properties, event);

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

        const cardCondition = (card: DrawCard) =>
            (!properties.cardCondition || properties.cardCondition(card, context)) &&
            (!properties.uniqueNames || !Array.from(selectedCards).some((sel) => sel.name === card.name)) &&
            (!properties.gameAction || properties.gameAction.canAffect(card, context, additionalProperties));
        const take = (card: DrawCard) => {
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
        };
        if(properties.targets && isBlindChoice(context, cards)) {
            const [card] = chooseBlindly(cards.filter(cardCondition), 1, !!properties.cardCondition);
            if(card) {
                take(card);
            } else {
                this.#handleDone(properties, context, event, selectedCards, cards);
            }
            return;
        }
        if((properties.hideIfNoLegalTargets || !canCancel) && !cards.some(cardCondition)) {
            this.#handleDone(properties, context, event, selectedCards, cards);
            return;
        }

        context.game.promptWithHandlerMenu(choosingPlayer, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardCondition,
            options: canCancel ? [{ text: properties.doneButtonText ?? (selectedCards.size > 0 ? 'Done' : 'Take nothing'), handler: () => this.#handleDone(properties, context, event, selectedCards, cards) }] : [],
            cardHandler: take
        });
    }

    #handleDone(
        properties: ResolvedDeckSearchProperties<Context>,
        context: Context,
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
        properties: ResolvedDeckSearchProperties<Context>,
        context: Context,
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
        properties: ResolvedDeckSearchProperties<Context>,
        context: Context,
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
        properties: ResolvedDeckSearchProperties<Context>,
        context: Context,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>
    ): void {
        const choosingPlayer = this.#chooser(properties, event);
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

    #takesNothing(properties: ResolvedDeckSearchProperties<Context>, context: Context, event: GameEvent<EventName.OnDeckSearch>): void {
        const choosingPlayer = this.#chooser(properties, event);
        const message = properties.takesNothingMessage ? properties.takesNothingMessage(context, choosingPlayer) : msg`${choosingPlayer} takes nothing`;
        if(message) {
            context.game.addMessage(message);
        }
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
