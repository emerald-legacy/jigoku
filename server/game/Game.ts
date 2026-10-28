import type { DeckDTO, UserIdentity, ShortCardData } from '../gamenode/LobbyProtocol.js';
import type { CardLibrary } from './types/CardClass.js';
import { ChatCommands } from './ChatCommands.js';
import { msg, GameChat } from './GameChat.js';
import type { MessageArgs } from './GameChat.js';
import { EffectEngine } from './EffectEngine.js';
import Player from './Player.js';
import type { ClockConfig } from './Clocks/ClockSelector.js';
import { Spectator } from './Spectator.js';
import { GamePipeline } from './GamePipeline.js';
import { SetupPhase } from './gamesteps/SetupPhase.js';
import { DynastyPhase } from './gamesteps/DynastyPhase.js';
import { DrawPhase } from './gamesteps/DrawPhase.js';
import { ConflictPhase } from './gamesteps/ConflictPhase.js';
import { FatePhase } from './gamesteps/FatePhase.js';
import { EndRoundPrompt } from './gamesteps/regroup/EndRoundPrompt.js';
import { SimpleStep } from './gamesteps/SimpleStep.js';
import { GameWonPrompt } from './gamesteps/GameWonPrompt.js';
import type { GameAction, GameActionTarget } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type { EventParams, GameEvent } from './Events/EventPayloads.js';
import type { EventWindow } from './Events/EventWindow.js';
import type { ThenEventWindow } from './Events/ThenEventWindow.js';
import { AbilityResolver } from './gamesteps/AbilityResolver.js';
import { SimultaneousEffectWindow } from './gamesteps/SimultaneousEffectWindow.js';
import type { SimultaneousEffectChoiceInput } from './gamesteps/SimultaneousEffectWindow.js';
import type { TriggerWindow } from './gamesteps/TriggerWindow.js';
import type { HonorBidPrompt } from './gamesteps/HonorBidPrompt.js';
import type { MenuHandlers, MenuPromptProperties } from './gamesteps/MenuPrompt.js';
import type { HandlerMenuPromptProperties } from './gamesteps/HandlerMenuPrompt.js';
import type { CardsChoice, OptionalCardChoice, SelectCardPromptProperties, SelectorChoice, SingleCardChoice } from './gamesteps/SelectCardPrompt.js';
import type { CardTypes } from './types/CardOfType.js';
import type { SelectRingPrompt } from './gamesteps/SelectRingPrompt.js';
import type { ActionWindow } from './gamesteps/ActionWindow.js';
import { AbilityContext } from './AbilityContext.js';
import Ring from './Ring.js';
import { Conflict } from './Conflict.js';
import type { Duel } from './Duel.js';
import { ConflictFlow } from './gamesteps/conflict/ConflictFlow.js';
import { GameInputHandler } from './GameInputHandler.js';
import { GameStateSerializer } from './GameStateSerializer.js';
import type { FormattedDeck, HiddenInfoChange } from './GameStateSerializer.js';
import type { MenuItem } from './MenuCommands.js';
import type { MenuArg, Step } from './gamesteps/Step.js';
import { GameEventManager } from './GameEventManager.js';
import { GameConnectionManager } from './GameConnectionManager.js';

import { type AbilityType, EventName, Location, ConflictType, Element, type Players, type Phase, RestrictionType, Stage, type Trait, type FavorType } from './Constants.js';
import { ConflictTracker, type ConflictRecord } from './ConflictTracker.js';
import type { ChoiceWindow } from './TriggeredAbility.js';
import { rulesFor, type GameRules } from './GameRules.js';
import { GamePromptHelper } from './GamePromptHelper.js';
import { isEnumValue } from './utils/helpers.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type { Socket } from '../Socket.js';
import type { AnimationEvent } from './AnimationEvent.js';
import type { GameRouter } from './GameRouter.js';
import type { GameSaveState, GameSummary } from '../gamenode/LobbyProtocol.js';
import type { PlayerState, GamePlayerUser } from './Player.js';

export interface SharedGameState {
    [key: string]: unknown;
}

export interface GameState {
    players: Record<string, PlayerState>;
    rings: Record<string, unknown>;
    messages: unknown[];
    [key: string]: unknown;
}

interface GameDetails {
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch?: boolean;
    owner: string;
    savedGameId?: string;
    gameType?: string;
    gameMode?: string;
    password?: string;
    players: Record<string, { id: string; user: GamePlayerUser }>;
    spectators: Record<string, { id: string; user: UserIdentity }>;
    clocks?: ClockConfig | null;
}

interface GameOptions {
    shortCardData?: ShortCardData[];
    cardLibrary?: CardLibrary;
    router?: GameRouter;
}

export class Game {
    private readonly events = new GameEventManager(this);

    effectEngine: EffectEngine;
    playersAndSpectators: Record<string, Player | Spectator>;
    gameChat: GameChat;
    chatCommands: ChatCommands;
    pipeline: GamePipeline;
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch?: boolean;
    owner: string;
    started: boolean;
    playStarted: boolean;
    createdAt: Date;
    savedGameId?: string;
    gameType?: string;
    currentAbilityWindow: TriggerWindow | SimultaneousEffectWindow | null;
    currentActionWindow: ActionWindow | null;
    currentEventWindow: EventWindow | null;
    currentConflict: Conflict | null;
    currentDuel: Duel | null;
    manualMode: boolean;
    /** Set when the game is created; a game keeps its mode. */
    readonly gameMode?: string;
    /** The rules of `gameMode`. */
    readonly rules: GameRules;
    /** Between phases: `''`. */
    currentPhase: Phase | '';
    password?: string;
    roundNumber: number;
    initialFirstPlayer: string | null;
    private conflictTracker: ConflictTracker;
    private readonly prompts: GamePromptHelper;
    private readonly input: GameInputHandler;
    private readonly serializer: GameStateSerializer;
    private readonly connections: GameConnectionManager;
    rings: Record<Element, Ring>;
    shortCardData: ShortCardData[];
    cardLibrary: CardLibrary;
    router?: GameRouter;
    allCards: BaseCard[];
    private cardsByUuid = new Map<string, BaseCard>();
    /** Effects both players resolve simultaneously: the game is won only once they're done (`suspendWinCheck`). */
    private winCheckSuspended = false;
    /** Status-token honor events of characters leaving play in the same step (`changeStatusTokenHonor`). */
    private statusTokenHonorEvents: Event[] | null = null;
    provinceCards: BaseCard[];
    winner?: Player;
    finishedAt?: Date;
    winReason?: string;
    hiddenInfoLog: HiddenInfoChange[];
    startedAt?: Date;
    private _playersCache: Player[] | null = null;
    private _spectatorsCache: Spectator[] | null = null;
    pendingAnimations: AnimationEvent[] = [];

    constructor(details: GameDetails, options: GameOptions = {}) {
        this.effectEngine = new EffectEngine(this);
        this.playersAndSpectators = {};
        this.gameChat = new GameChat();
        this.chatCommands = new ChatCommands(this);
        this.pipeline = new GamePipeline();
        this.id = details.id;
        this.name = details.name;
        this.allowSpectators = details.allowSpectators;
        this.spectatorSquelch = details.spectatorSquelch;
        this.owner = details.owner;
        this.started = false;
        this.playStarted = false;
        this.createdAt = new Date();
        this.savedGameId = details.savedGameId;
        this.gameType = details.gameType;
        this.currentAbilityWindow = null;
        this.currentActionWindow = null;
        this.currentEventWindow = null;
        this.currentConflict = null;
        this.currentDuel = null;
        this.manualMode = false;
        this.gameMode = details.gameMode;
        this.rules = rulesFor(details.gameMode);
        this.currentPhase = '';
        this.password = details.password;
        this.roundNumber = 0;
        this.initialFirstPlayer = null;

        this.conflictTracker = new ConflictTracker();
        this.prompts = new GamePromptHelper(this);
        this.input = new GameInputHandler(this);
        this.serializer = new GameStateSerializer(this);
        this.connections = new GameConnectionManager(this);
        this.rings = {
            air: new Ring(this, Element.Air, ConflictType.Military),
            earth: new Ring(this, Element.Earth, ConflictType.Political),
            fire: new Ring(this, Element.Fire, ConflictType.Military),
            void: new Ring(this, Element.Void, ConflictType.Political),
            water: new Ring(this, Element.Water, ConflictType.Military)
        };
        this.shortCardData = options.shortCardData || [];
        this.cardLibrary = options.cardLibrary ?? new Map();
        this.allCards = [];
        this.provinceCards = [];
        this.hiddenInfoLog = [];

        Object.values(details.players).forEach((player) => {
            this.playersAndSpectators[player.user.username] = new Player(
                player.id,
                player.user,
                this.owner === player.user.username,
                this,
                details.clocks ?? undefined
            );
        });

        Object.values(details.spectators).forEach((spectator) => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.router = options.router;
    }

    get conflictRecord(): ConflictRecord[] {
        return this.conflictTracker.records;
    }

    set conflictRecord(records: ConflictRecord[]) {
        this.conflictTracker.records = records;
    }

    /*
     * Reports errors from the game engine back to the router
     */
    reportError(e: Error): void {
        this.router?.handleError(this, e);
    }

    addAnimation(event: AnimationEvent): void {
        // a player's fate changes within one update show as one (a character's cost and its extra fate)
        if(event.type === 'fate') {
            const index = this.pendingAnimations.findIndex((pending) => pending.type === 'fate' && pending.playerName === event.playerName);
            const earlier = this.pendingAnimations[index];
            if(earlier?.type === 'fate') {
                const amount = earlier.amount + event.amount;
                if(amount === 0) {
                    this.pendingAnimations.splice(index, 1);
                } else {
                    this.pendingAnimations[index] = { ...earlier, amount };
                }
                return;
            }
        }
        this.pendingAnimations.push(event);
    }

    clearAnimations(): void {
        this.pendingAnimations = [];
    }

    /** Adds a message to the in-game chat, e.g. `msg\`${player} draws 1 card\``. */
    addMessage(message: MessageArgs): void {
        this.gameChat.addMessage(message);
    }

    /** Adds a message to the in-game chat with a graphical icon. */
    addAlert(type: string, message: MessageArgs): void {
        this.gameChat.addAlert(type, message);
    }

    get messages(): GameChat['messages'] {
        return this.gameChat.messages;
    }

    /**
     * Checks if a player is a spectator
     */
    isSpectator(player: Player | Spectator): player is Spectator {
        return player.constructor === Spectator;
    }

    private invalidatePlayerCaches(): void {
        this._playersCache = null;
        this._spectatorsCache = null;
    }

    addPlayerOrSpectator(name: string, playerOrSpectator: Player | Spectator): void {
        this.playersAndSpectators[name] = playerOrSpectator;
        this.invalidatePlayerCaches();
    }

    removePlayerOrSpectator(name: string): void {
        delete this.playersAndSpectators[name];
        this.invalidatePlayerCaches();
    }

    /**
     * Get all players (not spectators) in the game
     */
    getPlayers(): Player[] {
        if(!this._playersCache) {
            this._playersCache = Object.values(this.playersAndSpectators).filter((player): player is Player => !this.isSpectator(player));
        }
        return this._playersCache;
    }

    /**
     * Returns the Player object (not spectator) for a name
     */
    getPlayerByName(playerName: string): Player | undefined {
        const player = this.playersAndSpectators[playerName];
        if(player && !this.isSpectator(player)) {
            return player;
        }
        return undefined;
    }

    /**
     * Get all players (not spectators) with the first player at index 0
     */
    getPlayersInFirstPlayerOrder(): Player[] {
        return [...this.getPlayers()].sort((a, b) => Number(!!b.firstPlayer) - Number(!!a.firstPlayer));
    }

    /**
     * Get all players and spectators in the game
     */
    getPlayersAndSpectators(): Record<string, Player | Spectator> {
        return this.playersAndSpectators;
    }

    /**
     * Get all spectators in the game
     */
    getSpectators(): Spectator[] {
        if(!this._spectatorsCache) {
            this._spectatorsCache = Object.values(this.playersAndSpectators).filter((player) => this.isSpectator(player));
        }
        return this._spectatorsCache;
    }

    /**
     * Gets the current First Player
     */
    getFirstPlayer(): Player | undefined {
        return this.getPlayers().find((p) => p.firstPlayer);
    }

    /**
     * Gets a player other than the one passed (usually their opponent)
     */
    getOtherPlayer(player: Player): Player | undefined {
        return this.getPlayers().find((p) => {
            return p.name !== player.name;
        });
    }

    /**
     * Identity lookup only: returns the card object with this uuid for the game's
     * lifetime. uuids are never reused, but entries are never pruned either, so a
     * created token that has since left the game is still returned here. Callers must
     * re-check `location`/ownership rather than treating a hit as "still in play".
     */
    findAnyCardInAnyList(cardId: string): BaseCard | undefined {
        return this.cardsByUuid.get(cardId);
    }

    /**
     * Returns all cards from anywhere in the game matching the passed predicate
     */
    findAnyCardsInAnyList<Card extends BaseCard>(predicate: (card: BaseCard) => card is Card): Card[];
    findAnyCardsInAnyList(predicate: (card: BaseCard) => boolean): BaseCard[];
    findAnyCardsInAnyList(predicate: (card: BaseCard) => boolean): BaseCard[] {
        return this.allCards.filter(predicate);
    }

    /**
     * Returns all cards (i.e. characters) which matching the passed predicated
     * function from either players 'in play' area.
     */
    findAnyCardsInPlay(predicate: (card: DrawCard) => boolean): DrawCard[] {
        let foundCards: DrawCard[] = [];

        this.getPlayers().forEach((player) => {
            foundCards = foundCards.concat(player.findCards(player.cardsInPlay, predicate));
        });

        return foundCards;
    }

    /**
     * Returns if a card is in play (characters, attachments, provinces, holdings) that has the passed trait
     */
    isTraitInPlay(trait: Trait): boolean {
        return this.getPlayers().some((player) => player.isTraitInPlay(trait));
    }

    /** The ring of an element named by a string; `undefined` for any other name (one from the client may be anything). */
    ringFor(element: string): Ring | undefined {
        return isEnumValue(Element, element) ? this.rings[element] : undefined;
    }

    getProvinceArray(includeStronghold: boolean = true): Location[] {
        const array = [...this.rules.setupNonStrongholdProvinces];
        if(includeStronghold && this.rules.setupHaveStrongholds) {
            array.push(Location.StrongholdProvince);
        }
        return array;
    }

    createToken(card: DrawCard, token: new (card: DrawCard) => DrawCard): DrawCard {
        const tokenCard = new token(card);
        this.allCards.push(tokenCard);
        this.cardsByUuid.set(tokenCard.uuid, tokenCard);
        return tokenCard;
    }

    requireConflict(): Conflict {
        if(!this.currentConflict) {
            throw new Error('No conflict in progress');
        }
        return this.currentConflict;
    }

    /** Whether a conflict is going on, of every type and element given. */
    isDuringConflict(types: ConflictType | Element | Array<ConflictType | Element> | null = null): boolean {
        const conflict = this.currentConflict;
        if(!conflict) {
            return false;
        } else if(!types) {
            return true;
        } else if(!Array.isArray(types)) {
            types = [types];
        }
        const elementsAndType: string[] = [...conflict.elements, conflict.conflictType].filter((value) => value !== undefined);
        return types.every((type) => elementsAndType.includes(type));
    }

    recordConflict(conflict: Conflict): void {
        this.conflictTracker.record(conflict);
    }

    getConflicts(player: Player | Players.All): ConflictRecord[] {
        return this.conflictTracker.getForPlayer(player);
    }

    /** The number of conflicts the player declared this round, not counting passed ones. */
    getDeclaredConflictCount(player: Player): number {
        return this.getConflicts(player).filter((conflict) => !conflict.passed).length;
    }

    recordConflictWinner(conflict: Conflict): void {
        this.conflictTracker.recordWinner(conflict);
    }

    stopNonChessClocks(): void {
        this.getPlayers().forEach((player) => player.stopNonChessClocks());
    }

    stopClocks(): void {
        this.getPlayers().forEach((player) => player.stopClock());
    }

    /**
     * This function is called from the client whenever a card is clicked
     */
    cardClicked(sourcePlayer: string, cardId: string): void {
        this.input.cardClicked(sourcePlayer, cardId);
    }

    facedownCardClicked(
        playerName: string,
        location: string,
        controllerName: string,
        isProvince: boolean = false
    ): void {
        this.input.facedownCardClicked(playerName, location, controllerName, isProvince);
    }

    ringClicked(sourcePlayer: string, ringindex: string): void {
        this.input.ringClicked(sourcePlayer, ringindex);
    }

    menuItemClick(sourcePlayer: string, cardId: string, menuItem: MenuItem): void {
        this.input.menuItemClick(sourcePlayer, cardId, menuItem);
    }

    ringMenuItemClick(sourcePlayer: string, sourceRing: { element: string }, menuItem: MenuItem): void {
        this.input.ringMenuItemClick(sourcePlayer, sourceRing, menuItem);
    }

    showConflictDeck(playerName: string): void {
        this.input.showConflictDeck(playerName);
    }

    showDynastyDeck(playerName: string): void {
        this.input.showDynastyDeck(playerName);
    }

    drop(playerName: string, cardId: string, source: string, target: string): void {
        this.input.drop(playerName, cardId, source, target);
    }

    /**
     * Check to see if either player has won/lost the game due to honor (NB: this
     * function doesn't check to see if a conquest victory has been achieved)
     */
    checkWinCondition(): void {
        if(this.winCheckSuspended) {
            return;
        }
        const honorRequiredToWin = this.rules.winConRequiredHonorForWin;
        for(const player of this.getPlayersInFirstPlayerOrder()) {
            if(player.honor >= honorRequiredToWin) {
                this.recordWinner(player, 'honor');
            } else if(player.opponent && player.opponent.honor <= 0) {
                this.recordWinner(player, 'dishonor');
            }
        }
    }

    /** Until `resumeWinCheck`, honor changes don't win the game: both players' effects resolve simultaneously (A Season of War). */
    suspendWinCheck(): void {
        this.winCheckSuspended = true;
    }

    /** Checks for a winner after simultaneous effects; if both players would lose, the first player wins (EmeraldDB ruling). */
    resumeWinCheck(): void {
        this.winCheckSuspended = false;
        this.checkWinCondition();
    }

    /**
     * Display message declaring victory for one player, and record stats for
     * the game
     */
    recordWinner(winner: Player, reason: string): void {
        if(this.winner) {
            return;
        }

        this.addMessage(msg`${winner} has won the game`);

        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router?.gameWon(this, reason, winner);

        this.queueStep(new GameWonPrompt(this, winner));
    }

    /**
     * Designate a player as First Player
     */
    setFirstPlayer(firstPlayer: Player): void {
        if(!this.initialFirstPlayer) {
            this.initialFirstPlayer = firstPlayer.name;
        }
        for(const player of this.getPlayers()) {
            if(player === firstPlayer) {
                player.firstPlayer = true;
            } else {
                player.firstPlayer = false;
            }
        }
    }

    /**
     * Changes a Player variable and displays a message in chat
     */
    changeStat(playerName: string, stat: string, value: number): void {
        this.input.changeStat(playerName, stat, value);
    }

    /**
     * This function is called by the client every time a player enters a chat message
     */
    chat(playerName: string, message: string): void {
        this.input.chat(playerName, message);
    }

    /**
     * This is called by the client when a player clicks 'Concede'
     */
    concede(playerName: string): void {
        this.input.concede(playerName);
    }

    selectDeck(playerName: string, deck: DeckDTO): void {
        this.input.selectDeck(playerName, deck);
    }

    shuffleConflictDeck(playerName: string): void {
        this.input.shuffleConflictDeck(playerName);
    }

    shuffleDynastyDeck(playerName: string): void {
        this.input.shuffleDynastyDeck(playerName);
    }

    promptWithMenu(player: Player, handlers: MenuHandlers, properties: MenuPromptProperties): void {
        this.prompts.promptWithMenu(player, handlers, properties);
    }

    /** "Name a card": the player types a card name, and `onName` gets it. */
    promptForCardName(player: Player, onName: (player: Player, cardName: string) => void, menuTitle?: string): void {
        this.prompts.promptForCardName(player, onName, menuTitle);
    }

    promptWithHandlerMenu<Card extends BaseCard, ChoiceValue extends string | number | undefined>(player: Player, properties: HandlerMenuPromptProperties<Card, ChoiceValue>): void {
        this.prompts.promptWithHandlerMenu(player, properties);
    }

    promptForSelect<const Types extends CardTypes = undefined>(player: Player, properties: SingleCardChoice<Types>): void;
    promptForSelect<const Types extends CardTypes = undefined>(player: Player, properties: OptionalCardChoice<Types>): void;
    promptForSelect<const Types extends CardTypes = undefined>(player: Player, properties: CardsChoice<Types>): void;
    promptForSelect(player: Player, properties: SelectorChoice): void;
    promptForSelect<Types extends CardTypes>(player: Player, properties: SelectCardPromptProperties<Types>): void {
        this.prompts.promptForSelect(player, properties);
    }

    promptForRingSelect(player: Player, properties: ConstructorParameters<typeof SelectRingPrompt>[2]): void {
        this.prompts.promptForRingSelect(player, properties);
    }

    promptForHonorBid(activePromptTitle: string, costHandler?: ConstructorParameters<typeof HonorBidPrompt>[2], prohibitedBids?: ConstructorParameters<typeof HonorBidPrompt>[3], duel: ConstructorParameters<typeof HonorBidPrompt>[4] = null): void {
        this.prompts.promptForHonorBid(activePromptTitle, costHandler, prohibitedBids, duel);
    }

    /**
     * This function is called by the client whenever a player clicks a button
     * in a prompt
     */
    menuButton(playerName: string, arg: MenuArg, uuid: string, method?: string | null): boolean {
        return this.input.menuButton(playerName, arg, uuid, method);
    }

    togglePromptedActionWindow(playerName: string, windowName: string, toggle: boolean): void {
        this.input.togglePromptedActionWindow(playerName, windowName, toggle);
    }

    toggleTimerSetting(playerName: string, settingName: string, toggle: boolean): void {
        this.input.toggleTimerSetting(playerName, settingName, toggle);
    }

    toggleOptionSetting(playerName: string, settingName: string, toggle: boolean): void {
        this.input.toggleOptionSetting(playerName, settingName, toggle);
    }

    toggleManualMode(playerName: string): void {
        this.input.toggleManualMode(playerName);
    }

    /*
     * Sets up Player objects, creates allCards, checks each player has a stronghold
     * and starts the game pipeline
     */
    initialise(): boolean | void {
        const players: Record<string, Player | Spectator> = {};

        Object.values(this.playersAndSpectators).forEach((player) => {
            if(!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        let playerWithNoStronghold: Player | null = null;

        for(const player of this.getPlayers()) {
            player.initialise();
            if(this.rules.setupHaveStrongholds && !player.stronghold) {
                playerWithNoStronghold = player;
            }
        }

        this.allCards = this.getPlayers().reduce((cards: BaseCard[], player: Player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []);
        this.cardsByUuid.clear();
        for(const card of this.allCards) {
            this.cardsByUuid.set(card.uuid, card);
        }
        this.provinceCards = this.allCards.filter((card) => card.isProvince);

        if(this.rules.setupHaveStrongholds) {
            if(playerWithNoStronghold) {
                this.queueSimpleStep(() => {
                    this.addMessage(msg`Invalid Deck Detected: ${playerWithNoStronghold} does not have a stronghold in their decklist`);
                    return false;
                });
                this.continue();
                return false;
            }

            for(const player of this.getPlayers()) {
                const numProvinces = this.provinceCards.filter((a) => a.controller === player);
                if(numProvinces.length !== 5) {
                    this.queueSimpleStep(() => {
                        this.addMessage(msg`Invalid Deck Detected: ${player} has ${numProvinces.length} provinces`);
                        return false;
                    });
                    this.continue();
                    return false;
                }
            }
        }

        this.pipeline.initialise([new SetupPhase(this), new SimpleStep(this, () => this.beginRound())]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.continue();
    }

    /*
     * Adds each of the game's main phases to the pipeline
     */
    beginRound(): void {
        this.resetLimitedForPlayer();
        this.roundNumber++;
        this.raiseEvent(EventName.OnBeginRound);
        this.queueStep(new DynastyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new ConflictPhase(this));
        this.queueStep(new FatePhase(this));
        this.queueStep(new EndRoundPrompt(this));
        this.queueStep(new SimpleStep(this, () => this.roundEnded()));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    roundEnded(): void {
        this.raiseEvent(EventName.OnRoundEnded);
    }

    resetLimitedForPlayer(): void {
        const players = this.getPlayers();
        players.forEach((player) => {
            player.limitedPlayed = 0;
        });
    }

    /*
     * Adds a step to the pipeline queue
     */
    queueStep<Value extends Step>(step: Value): Value {
        this.pipeline.queueStep(step);
        return step;
    }

    /*
     * Creates a step which calls a handler function
     */
    queueSimpleStep(handler: () => unknown): void {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    /*
     * Resolves a card ability or ring effect
     */
    resolveAbility(context: AbilityContext): AbilityResolver {
        const resolver = new AbilityResolver(this, context);
        this.queueStep(resolver);
        return resolver;
    }

    openSimultaneousEffectWindow(choices: SimultaneousEffectChoiceInput[]): void {
        const window = new SimultaneousEffectWindow(this);
        choices.forEach((choice) => window.addChoice(choice));
        this.queueStep(window);
    }

    getEvent<EventType extends EventName>(eventName: EventType, params?: EventParams<EventType>, handler?: (event: GameEvent<EventType>) => void): GameEvent<EventType> {
        return this.events.getEvent(eventName, params, handler);
    }

    /**
     * Creates a game Event, and opens a window for it.
     */
    raiseEvent<EventType extends EventName>(eventName: EventType, params?: EventParams<EventType>, handler?: (event: GameEvent<EventType>) => void): GameEvent<EventType> {
        return this.events.raiseEvent(eventName, params, handler);
    }

    emitEvent<EventType extends EventName>(eventName: EventType, params?: EventParams<EventType>): void {
        this.events.emitEvent(eventName, params);
    }

    /** Tells the listeners to a game event that it happened. */
    emit(event: Event): void {
        this.events.emit(event);
    }

    on<EventType extends EventName>(eventName: EventType, handler: (event: GameEvent<EventType>) => void): void {
        this.events.on(eventName, handler);
    }

    off<EventType extends EventName>(eventName: EventType, handler: (event: GameEvent<EventType>) => void): void {
        this.events.off(eventName, handler);
    }

    /** Called for each event of an `abilityType` trigger window, with the window to offer abilities to (none for other effects). */
    onTriggerWindow<EventType extends EventName>(eventName: EventType, abilityType: AbilityType, handler: (event: GameEvent<EventType>, window?: ChoiceWindow) => void): void {
        this.events.onTriggerWindow(eventName, abilityType, handler);
    }

    onceTriggerWindow<EventType extends EventName>(eventName: EventType, abilityType: AbilityType, handler: (event: GameEvent<EventType>, window?: ChoiceWindow) => void): void {
        this.events.onceTriggerWindow(eventName, abilityType, handler);
    }

    offTriggerWindow<EventType extends EventName>(eventName: EventType, abilityType: AbilityType, handler: (event: GameEvent<EventType>, window?: ChoiceWindow) => void): void {
        this.events.offTriggerWindow(eventName, abilityType, handler);
    }

    emitTriggerWindow(event: Event, abilityType: AbilityType, window?: ChoiceWindow): void {
        this.events.emitTriggerWindow(event, abilityType, window);
    }

    /** Called once per `abilityType` trigger window, with all of its events. */
    onAggregateWindow(abilityType: AbilityType, handler: (events: Event[], window: ChoiceWindow) => void): void {
        this.events.onAggregateWindow(abilityType, handler);
    }

    offAggregateWindow(abilityType: AbilityType, handler: (events: Event[], window: ChoiceWindow) => void): void {
        this.events.offAggregateWindow(abilityType, handler);
    }

    emitAggregateWindow(events: Event[], abilityType: AbilityType, window: ChoiceWindow): void {
        this.events.emitAggregateWindow(events, abilityType, window);
    }

    /**
     * Creates an EventWindow which will open windows for each kind of triggered
     * ability which can respond any passed events, and execute their handlers.
     */
    openEventWindow(events: Event | Event[]): EventWindow {
        return this.events.openEventWindow(events);
    }

    openThenEventWindow(events: Event | Event[]): EventWindow | ThenEventWindow {
        return this.events.openThenEventWindow(events);
    }

    /**
     * Honor from the status token of a character leaving play. Characters leaving play together change it at once
     * (EmeraldDB ruling): one window with gains before losses, so only the net change can make a player lose.
     */
    changeStatusTokenHonor(event: Event, gain: boolean): void {
        if(!this.statusTokenHonorEvents) {
            const events: Event[] = [];
            this.statusTokenHonorEvents = events;
            this.queueSimpleStep(() => {
                this.statusTokenHonorEvents = null;
                this.openThenEventWindow(events);
            });
        }
        if(gain) {
            this.statusTokenHonorEvents.unshift(event);
        } else {
            this.statusTokenHonorEvents.push(event);
        }
    }

    /**
     * Resolves game actions together: their events on all legal targets open in one window, then emptied provinces refill.
     * A single action inside an ability uses `action.resolve()`; the ability refills at its end.
     */
    resolveActions(actions: GameAction[], context: AbilityContext): Event[] {
        const events: Event[] = [];
        for(const action of actions) {
            action.addEventsToArray(events, context);
        }
        // an action may still add its event in a queued step (after an "unless" cost), so the window opens after those
        this.queueSimpleStep(() => {
            if(events.length > 0) {
                this.openEventWindow(events);
                this.queueSimpleStep(() => context.refill());
            }
        });
        return events;
    }

    /**
     * A rule step's action on each target, with the framework context of the player it acts for (the card's controller,
     * a ring's claimant), all in one window; then emptied provinces refill. So no rule step looks like an opponent's doing
     * to reactions that check who acted ("after an opponent's … bows a character you control").
     */
    resolveRuleAction(action: GameAction, targets: { target: GameActionTarget; player: Player }[]): Event[] {
        const events: Event[] = [];
        const contexts = new Map<Player, AbilityContext>();
        for(const { target, player } of targets) {
            const context = contexts.get(player) ?? this.getFrameworkContext(player);
            contexts.set(player, context);
            action.addEventsToArray(events, context, { target });
        }
        this.queueSimpleStep(() => {
            if(events.length > 0) {
                this.openEventWindow(events);
                this.queueSimpleStep(() => contexts.forEach((context) => context.refill()));
            }
        });
        return events;
    }

    /** A context for the game's own rules acting for `player`, outside any card ability. */
    getFrameworkContext(player: Player): AbilityContext {
        return new AbilityContext({ game: this, player });
    }

    /** A framework context for paying a rules cost, such as the costs to declare attackers or defenders. */
    getFrameworkCostContext(player: Player): AbilityContext {
        return new AbilityContext({ game: this, player, stage: Stage.Cost });
    }

    initiateConflict(
        player: Player,
        canPass: boolean,
        forcedDeclaredType?: ConflictType,
        forceProvinceTarget?: ProvinceCard
    ): void {
        const conflict = new Conflict(
            this,
            player,
            player.opponent,
            undefined,
            forceProvinceTarget,
            forcedDeclaredType
        );
        this.queueStep(new ConflictFlow(this, conflict, canPass));
    }

    updateCurrentConflict(conflict: Conflict | null): void {
        this.currentConflict = conflict;
        this.checkGameState(true);
    }

    /**
     * Changes the controller of a card in play to the passed player, and cleans
     * all the related stuff up (swapping sides in a conflict)
     */
    takeControl(player: Player, card: DrawCard): void {
        if(
            card.controller === player ||
            !card.checkRestrictions(RestrictionType.TakeControl, this.getFrameworkContext(player))
        ) {
            return;
        }
        card.controller.removeCardFromPile(card);
        player.cardsInPlay.push(card);
        card.controller = player;
        if(card.isParticipating() && this.currentConflict) {
            this.currentConflict.removeFromConflict(card);
            if(player.isAttackingPlayer()) {
                this.currentConflict.addAttacker(card);
            } else {
                this.currentConflict.addDefender(card);
            }
        }
        card.updateEffectContexts();
        this.checkGameState(true);
    }

    getFavorSide(): FavorType | undefined {
        for(const player of this.getPlayers()) {
            if(player.imperialFavor) {
                return player.imperialFavor;
            }
        }
        return undefined;
    }

    watch(socketId: string, user: UserIdentity): boolean {
        return this.connections.watch(socketId, user);
    }

    join(socketId: string, user: GamePlayerUser): boolean {
        return this.connections.join(socketId, user);
    }

    isEmpty(): boolean {
        return this.connections.isEmpty();
    }

    allPlayersGone(): boolean {
        return this.connections.allPlayersGone();
    }

    leave(playerName: string): void {
        this.connections.leave(playerName);
    }

    disconnect(playerName: string): void {
        this.connections.disconnect(playerName);
    }

    failedConnect(playerName: string): void {
        this.connections.failedConnect(playerName);
    }

    reconnect(socket: Socket, playerName: string): void {
        this.connections.reconnect(socket, playerName);
    }

    checkGameState(hasChanged: boolean = false, events: Event[] = []): void {
        // check for a game state change (recalculating conflict skill if necessary)
        if(
            (!this.currentConflict && this.effectEngine.checkEffects(hasChanged)) ||
            (this.currentConflict && this.currentConflict.calculateSkill(hasChanged)) ||
            hasChanged
        ) {
            this.checkWinCondition();
            // if the state has changed, check for:
            for(const player of this.getPlayers()) {
                player.cardsInPlay.forEach((card: DrawCard) => {
                    if(card.getModifiedController() !== player) {
                        // any card being controlled by the wrong player
                        this.takeControl(card.getModifiedController(), card);
                    }
                    // any attachments which are illegally attached
                    if(!card.checkForIllegalAttachments()) {
                        // queue in a separate gamestate check
                        // any tokens which are illegal
                        card.checkForIllegalTokens();
                    }
                });
                player.getProvinces().forEach((card) => {
                    if(card) {
                        card.checkForIllegalAttachments();
                    }
                });

                if(!player.checkRestrictions(RestrictionType.HaveImperialFavor, this.getFrameworkContext(player)) && player.imperialFavor !== '') {
                    this.addMessage(msg`The Imperial Favor is discarded as ${player} cannot have it`);
                    player.loseImperialFavor();
                }
            }
            if(this.currentConflict) {
                // conflicts with illegal participants
                this.currentConflict.checkForIllegalParticipants();
            }
        }
        if(events.length > 0) {
            // check for any delayed effects which need to fire
            this.effectEngine.checkDelayedEffects(events);
        }
    }

    continue(): void {
        this.pipeline.continue();
    }

    formatDeckForSaving(deck: DeckDTO): FormattedDeck {
        return this.serializer.formatDeckForSaving(deck);
    }

    /*
     * This information is all logged when a game is won
     */
    getSaveState(): GameSaveState {
        return this.serializer.getSaveState();
    }

    /**
     * Pre-compute state shared across all viewers (conflict, messages, spectators, metadata).
     * Pass the result to getState() to avoid redundant work when sending to multiple clients.
     */
    getSharedState(): SharedGameState | null {
        return this.serializer.getSharedState();
    }

    getState(activePlayerName?: string, sharedState?: SharedGameState | null): GameState | GameSummary | undefined {
        return this.serializer.getState(activePlayerName, sharedState);
    }

    getHiddenInfoFingerprint(): string {
        return this.serializer.getHiddenInfoFingerprint();
    }

    /**
     * Numbers the state about to be sent and logs the hidden card identities (hands + facedown provinces)
     * for the replay when they changed since the last entry. Returns the state's number, or undefined once
     * the winning state was recorded: the replay ends there.
     */
    recordHiddenInfo(): number | undefined {
        return this.serializer.recordHiddenInfo();
    }

    getHiddenInfo(): Record<string, unknown> {
        return this.serializer.getHiddenInfo();
    }

    getSummary(activePlayerName?: string): GameSummary | undefined {
        return this.serializer.getSummary(activePlayerName);
    }
}

export default Game;
