import { EventEmitter } from 'events';

import ChatCommands from './chatcommands.js';
import { GameChat } from './GameChat';
import { EffectEngine } from './EffectEngine.js';
import Player from './player.js';
import { Spectator } from './Spectator.js';
import { AnonymousSpectator } from './AnonymousSpectator';
import { GamePipeline } from './GamePipeline.js';
import { SetupPhase } from './gamesteps/SetupPhase.js';
import { DynastyPhase } from './gamesteps/DynastyPhase.js';
import { DrawPhase } from './gamesteps/DrawPhase.js';
import { ConflictPhase } from './gamesteps/ConflictPhase.js';
import { FatePhase } from './gamesteps/FatePhase.js';
import { EndRoundPrompt } from './gamesteps/regroup/EndRoundPrompt.js';
import { SimpleStep } from './gamesteps/SimpleStep.js';
import GameWonPrompt from './gamesteps/GameWonPrompt';
import * as GameActions from './GameActions/GameActions';
import { Event } from './Events/Event';
import InitiateCardAbilityEvent from './Events/InitiateCardAbilityEvent';
import EventWindow from './Events/EventWindow';
import ThenEventWindow from './Events/ThenEventWindow';
import InitiateAbilityEventWindow from './Events/InitiateAbilityEventWindow';
import AbilityResolver from './gamesteps/abilityresolver';
import SimultaneousEffectWindow from './gamesteps/SimultaneousEffectWindow';
import { AbilityContext } from './AbilityContext.js';
import Ring from './ring.js';
import { Conflict } from './conflict.js';
import ConflictFlow from './gamesteps/conflict/conflictflow.js';
import * as MenuCommands from './MenuCommands';
import SpiritOfTheRiver from './cards/SpiritOfTheRiver';

import { EffectNames, Phases, EventNames, Locations, ConflictTypes, Elements } from './Constants';
import { ConflictTracker, type ConflictRecord } from './ConflictTracker';
import { GamePromptHelper } from './GamePromptHelper';
import { GameModes } from '../GameModes.js';
import { resolvePackId } from './CardPackUtil';
import type BaseCard from './basecard';
import type DrawCard from './drawcard';
import type { AnimationEvent } from './AnimationEvent';

interface GameDetails {
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch: boolean;
    owner: any;
    savedGameId?: string;
    gameType: string;
    gameMode: string;
    password?: string;
    players: Record<string, any>;
    spectators: Record<string, any>;
    clocks: any;
}

interface GameOptions {
    shortCardData?: any[];
    router?: any;
}

class Game extends EventEmitter {
    effectEngine: EffectEngine;
    playersAndSpectators: Record<string, Player | Spectator>;
    gameChat: GameChat;
    chatCommands: ChatCommands;
    pipeline: GamePipeline;
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch: boolean;
    owner: any;
    started: boolean;
    playStarted: boolean;
    createdAt: Date;
    savedGameId?: string;
    gameType: string;
    currentAbilityWindow: any;
    currentActionWindow: any;
    currentEventWindow: any;
    currentConflict: any;
    currentDuel: any;
    manualMode: boolean;
    gameMode: string;
    currentPhase: string;
    password?: string;
    roundNumber: number;
    initialFirstPlayer: string | null;
    private conflictTracker: ConflictTracker;
    readonly prompts: GamePromptHelper;
    rings: Record<string, Ring>;
    shortCardData: any[];
    router: any;
    allCards: BaseCard[];
    private cardsByUuid = new Map<string, BaseCard>();
    provinceCards: BaseCard[];
    winner?: Player;
    finishedAt?: Date;
    winReason?: string;
    hiddenInfoLog: any[];
    private lastHiddenInfoFingerprint = '';
    startedAt?: Date;
    private _playersCache: Player[] | null = null;
    private _spectatorsCache: Spectator[] | null = null;
    pendingAnimations: AnimationEvent[] = [];

    constructor(details: GameDetails, options: GameOptions = {}) {
        super();

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
        this.currentPhase = '';
        this.password = details.password;
        this.roundNumber = 0;
        this.initialFirstPlayer = null;

        this.conflictTracker = new ConflictTracker();
        this.prompts = new GamePromptHelper(this);
        this.rings = {
            air: new Ring(this, Elements.Air, ConflictTypes.Military),
            earth: new Ring(this, Elements.Earth, ConflictTypes.Political),
            fire: new Ring(this, Elements.Fire, ConflictTypes.Military),
            void: new Ring(this, Elements.Void, ConflictTypes.Political),
            water: new Ring(this, Elements.Water, ConflictTypes.Military)
        };
        this.shortCardData = options.shortCardData || [];
        this.allCards = [];
        this.provinceCards = [];
        this.hiddenInfoLog = [];

        Object.values(details.players).forEach((player: any) => {
            this.playersAndSpectators[player.user.username] = new Player(
                player.id,
                player.user,
                this.owner === player.user.username,
                this,
                details.clocks
            );
        });

        Object.values(details.spectators).forEach((spectator: any) => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.setMaxListeners(0);

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
        this.router.handleError(this, e);
    }

    addAnimation(event: AnimationEvent): void {
        this.pendingAnimations.push(event);
    }

    clearAnimations(): void {
        this.pendingAnimations = [];
    }

    /**
     * Adds a message to the in-game chat e.g 'Jadiel draws 1 card'
     */
    addMessage(message: string, ...args: any[]): void {
        this.gameChat.addMessage(message, ...args);
    }

    /**
     * Adds a message to in-game chat with a graphical icon
     */
    addAlert(type: string, message: string, ...args: any[]): void {
        this.gameChat.addAlert(type, message, ...args);
    }

    get messages(): any[] {
        return this.gameChat.messages;
    }

    /**
     * Checks if a player is a spectator
     */
    isSpectator(player: any): boolean {
        return player.constructor === Spectator;
    }

    private invalidatePlayerCaches(): void {
        this._playersCache = null;
        this._spectatorsCache = null;
    }

    /**
     * Checks whether a player/spectator is still in the game
     */
    hasActivePlayer(playerName: string): boolean {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    /**
     * Get all players (not spectators) in the game
     */
    getPlayers(): Player[] {
        if(!this._playersCache) {
            this._playersCache = Object.values(this.playersAndSpectators).filter((player) => !this.isSpectator(player)) as Player[];
        }
        return this._playersCache;
    }

    /**
     * Returns the Player object (not spectator) for a name
     */
    getPlayerByName(playerName: string): Player | undefined {
        const player = this.playersAndSpectators[playerName];
        if(player && !this.isSpectator(player)) {
            return player as Player;
        }
        return undefined;
    }

    /**
     * Get all players (not spectators) with the first player at index 0
     */
    getPlayersInFirstPlayerOrder(): Player[] {
        return this.getPlayers().sort((a) => (a.firstPlayer ? -1 : 1));
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
            this._spectatorsCache = Object.values(this.playersAndSpectators).filter((player) => this.isSpectator(player)) as Spectator[];
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
     * Returns the card (i.e. character) with matching uuid from either players
     * 'in play' area.
     */
    findAnyCardInPlayByUuid(cardId: string): DrawCard | null {
        return this.getPlayers().reduce((card: DrawCard | null, player: Player) => {
            if(card) {
                return card;
            }
            return player.findCardInPlayByUuid(cardId);
        }, null);
    }

    /**
     * Returns the card with matching uuid from anywhere in the game
     */
    findAnyCardInAnyList(cardId: string): BaseCard | undefined {
        return this.cardsByUuid.get(cardId);
    }

    /**
     * Returns all cards from anywhere in the game matching the passed predicate
     */
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
    isTraitInPlay(trait: string): boolean {
        return this.getPlayers().some((player) => player.isTraitInPlay(trait));
    }

    getProvinceArray(includeStronghold: boolean = true): Locations[] {
        if(this.gameMode === GameModes.Skirmish) {
            return [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree];
        }
        let array: Locations[] = [
            Locations.ProvinceOne,
            Locations.ProvinceTwo,
            Locations.ProvinceThree,
            Locations.ProvinceFour
        ];
        if(includeStronghold) {
            array.push(Locations.StrongholdProvince);
        }
        return array;
    }

    createToken(card: DrawCard, token?: any): DrawCard {
        let tokenCard: DrawCard;
        if(!token) {
            tokenCard = new SpiritOfTheRiver(card);
        } else {
            tokenCard = new token(card);
        }
        this.allCards.push(tokenCard);
        this.cardsByUuid.set(tokenCard.uuid, tokenCard);
        return tokenCard;
    }

    get actions(): typeof GameActions {
        return GameActions;
    }

    isDuringConflict(types: string | string[] | null = null): boolean {
        if(!this.currentConflict) {
            return false;
        } else if(!types) {
            return true;
        } else if(!Array.isArray(types)) {
            types = [types];
        }
        return types.every((type) =>
            this.currentConflict.elements.concat(this.currentConflict.conflictType).includes(type)
        );
    }

    recordConflict(conflict: any): void {
        this.conflictTracker.record(conflict);
    }

    getConflicts(player: Player): ConflictRecord[] {
        return this.conflictTracker.getForPlayer(player);
    }

    recordConflictWinner(conflict: any): void {
        this.conflictTracker.recordWinner(conflict);
    }

    stopNonChessClocks(): void {
        this.getPlayers().forEach((player) => player.stopNonChessClocks());
    }

    stopClocks(): void {
        this.getPlayers().forEach((player) => player.stopClock());
    }

    resetClocks(): void {
        this.getPlayers().forEach((player) => player.resetClock());
    }

    /**
     * This function is called from the client whenever a card is clicked
     */
    cardClicked(sourcePlayer: string, cardId: string): void {
        const player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        const card = this.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.pipeline.handleCardClicked(player, card);
    }

    facedownCardClicked(
        playerName: string,
        location: string,
        controllerName: string,
        isProvince: boolean = false
    ): void {
        const player = this.getPlayerByName(playerName);
        const controller = this.getPlayerByName(controllerName);
        if(!player || !controller) {
            return;
        }
        const list = controller.getSourceList(location);
        if(!list) {
            return;
        }
        const card = list.find((card: BaseCard) => !isProvince === !(card as any).isProvince);
        if(card) {
            this.pipeline.handleCardClicked(player, card);
            return;
        }
    }

    /**
     * This function is called from the client whenever a ring is clicked
     */
    ringClicked(sourcePlayer: string, ringindex: string): void {
        const ring = this.rings[ringindex];
        const player = this.getPlayerByName(sourcePlayer);

        if(!player || !ring) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        if(this.pipeline.handleRingClicked(player, ring)) {
            return;
        }

        // If it's not the conflict phase and the ring hasn't been claimed, flip it
        if(this.currentPhase !== Phases.Conflict && !ring.claimed) {
            ring.flipConflictType();
        }
    }

    /**
     * This function is called by the client when a card menu item is clicked
     */
    menuItemClick(sourcePlayer: string, cardId: string, menuItem: any): void {
        const player = this.getPlayerByName(sourcePlayer);
        const card = this.findAnyCardInAnyList(cardId);
        if(!player || !card) {
            return;
        }

        if(menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, cardId);
            return;
        }

        MenuCommands.cardMenuClick(menuItem, this, player, card);
        this.checkGameState(true);
    }

    /**
     * This function is called by the client when a ring menu item is clicked
     */
    ringMenuItemClick(sourcePlayer: string, sourceRing: { element: string }, menuItem: any): void {
        const player = this.getPlayerByName(sourcePlayer);
        const ring = this.rings[sourceRing.element];
        if(!player || !ring) {
            return;
        }

        if(menuItem.command === 'click') {
            this.ringClicked(sourcePlayer, ring.element);
            return;
        }
        MenuCommands.ringMenuClick(menuItem, this, player, ring);
        this.checkGameState(true);
    }

    /**
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's conflict deck is open
     */
    showConflictDeck(playerName: string): void {
        const player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showConflict) {
            player.showConflictDeck();

            this.addMessage('{0} is looking at their conflict deck', player);
        } else {
            player.showConflict = false;

            this.addMessage('{0} stops looking at their conflict deck', player);
        }
    }

    /**
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's dynasty deck is open
     */
    showDynastyDeck(playerName: string): void {
        const player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showDynasty) {
            player.showDynastyDeck();

            this.addMessage('{0} is looking at their dynasty deck', player);
        } else {
            player.showDynasty = false;

            this.addMessage('{0} stops looking at their dynasty deck', player);
        }
    }

    /**
     * This function is called from the client whenever a card is dragged from
     * one place to another
     */
    drop(playerName: string, cardId: string, source: string, target: string): void {
        const player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        player.drop(cardId, source, target);
    }

    /**
     * Check to see if either player has won/lost the game due to honor (NB: this
     * function doesn't check to see if a conquest victory has been achieved)
     */
    checkWinCondition(): void {
        const honorRequiredToWin = this.gameMode === GameModes.Skirmish ? 12 : 25;
        for(const player of this.getPlayersInFirstPlayerOrder()) {
            if(player.honor >= honorRequiredToWin) {
                this.recordWinner(player, 'honor');
            } else if(player.opponent && player.opponent.honor <= 0) {
                this.recordWinner(player, 'dishonor');
            }
        }
    }

    /**
     * Display message declaring victory for one player, and record stats for
     * the game
     */
    recordWinner(winner: Player, reason: string): void {
        if(this.winner) {
            return;
        }

        this.addMessage('{0} has won the game', winner);

        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router.gameWon(this, reason, winner);

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
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        const target: any = player;

        target[stat] += value;

        if(target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.addMessage('{0} sets {1} to {2} ({3})', player, stat, target[stat], (value > 0 ? '+' : '') + value);
        }
    }

    /**
     * This function is called by the client every time a player enters a chat message
     */
    chat(playerName: string, message: string): void {
        const player = this.playersAndSpectators[playerName];
        const args = message.split(' ');

        if(!player) {
            return;
        }

        if(!this.isSpectator(player)) {
            if(this.chatCommands.executeCommand(player as Player, args[0], args)) {
                this.checkGameState(true);
                return;
            }

            const card = Object.values(this.shortCardData).find((c: any) => {
                return c.name.toLowerCase() === message.toLowerCase() || c.id.toLowerCase() === message.toLowerCase();
            }) as any;

            if(card) {
                const packId = resolvePackId(undefined, card, this.gameMode);
                const cardFragment = { id: card.id, name: card.name, type: card.type, packId };
                this.gameChat.addChatMessage(player as Player, { message: this.gameChat.formatMessage('{0}', [cardFragment]) });

                return;
            }
        }

        if(!this.isSpectator(player) || !this.spectatorSquelch) {
            this.gameChat.addChatMessage(player as Player, message);
        }
    }

    /**
     * This is called by the client when a player clicks 'Concede'
     */
    concede(playerName: string): void {
        const player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.addMessage('{0} concedes', player);

        const otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.recordWinner(otherPlayer, 'concede');
        }
    }

    selectDeck(playerName: string, deck: any): void {
        const player = this.getPlayerByName(playerName);
        if(player) {
            player.selectDeck(deck);
        }
    }

    /**
     * Called when a player clicks Shuffle Deck on the conflict deck menu in
     * the client
     */
    shuffleConflictDeck(playerName: string): void {
        const player = this.getPlayerByName(playerName);
        if(player) {
            player.shuffleConflictDeck();
        }
    }

    /**
     * Called when a player clicks Shuffle Deck on the dynasty deck menu in
     * the client
     */
    shuffleDynastyDeck(playerName: string): void {
        const player = this.getPlayerByName(playerName);
        if(player) {
            player.shuffleDynastyDeck();
        }
    }

    promptWithMenu(player: Player, contextObj: any, properties: any): void {
        this.prompts.promptWithMenu(player, contextObj, properties);
    }

    promptWithHandlerMenu(player: Player, properties: any): void {
        this.prompts.promptWithHandlerMenu(player, properties);
    }

    promptForSelect(player: Player, properties: any): void {
        this.prompts.promptForSelect(player, properties);
    }

    promptForRingSelect(player: Player, properties: any): void {
        this.prompts.promptForRingSelect(player, properties);
    }

    promptForHonorBid(activePromptTitle: string, costHandler?: any, prohibitedBids?: any, duel: any = null): void {
        this.prompts.promptForHonorBid(activePromptTitle, costHandler, prohibitedBids, duel);
    }

    /**
     * This function is called by the client whenever a player clicks a button
     * in a prompt
     */
    menuButton(playerName: string, arg: string, uuid: string, method: string): boolean {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return false;
        }

        // check to see if the current step in the pipeline is waiting for input
        return this.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    /**
     * This function is called by the client when a player clicks an action window
     * toggle in the settings menu
     */
    togglePromptedActionWindow(playerName: string, windowName: string, toggle: boolean): void {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.promptedActionWindows[windowName] = toggle;
    }

    /**
     * This function is called by the client when a player clicks an timer setting
     * toggle in the settings menu
     */
    toggleTimerSetting(playerName: string, settingName: string, toggle: boolean): void {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.timerSettings[settingName] = toggle;
    }

    /*
     * This function is called by the client when a player clicks an option setting
     * toggle in the settings menu
     */
    toggleOptionSetting(playerName: string, settingName: string, toggle: boolean): void {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.optionSettings[settingName] = toggle;
    }

    toggleManualMode(playerName: string): void {
        this.chatCommands.manual(this.getPlayerByName(playerName) as Player);
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
            if(this.gameMode !== GameModes.Skirmish && !player.stronghold) {
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
        this.provinceCards = this.allCards.filter((card) => (card as any).isProvince);

        if(this.gameMode !== GameModes.Skirmish) {
            if(playerWithNoStronghold) {
                this.queueSimpleStep(() => {
                    this.addMessage(
                        'Invalid Deck Detected: {0} does not have a stronghold in their decklist',
                        playerWithNoStronghold
                    );
                    return false;
                });
                this.continue();
                return false;
            }

            for(const player of this.getPlayers()) {
                const numProvinces = this.provinceCards.filter((a: any) => a.controller === player);
                if(numProvinces.length !== 5) {
                    this.queueSimpleStep(() => {
                        this.addMessage('Invalid Deck Detected: {0} has {1} provinces', player, numProvinces.length);
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
        this.raiseEvent(EventNames.OnBeginRound);
        this.queueStep(new DynastyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new ConflictPhase(this));
        this.queueStep(new FatePhase(this));
        this.queueStep(new EndRoundPrompt(this));
        this.queueStep(new SimpleStep(this, () => this.roundEnded()));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    roundEnded(): void {
        this.raiseEvent(EventNames.OnRoundEnded);
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
    queueStep(step: any): any {
        this.pipeline.queueStep(step);
        return step;
    }

    /*
     * Creates a step which calls a handler function
     */
    queueSimpleStep(handler: () => any): void {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    /*
     * Tells the current action window that the player with priority has taken
     * an action (and so priority should pass to the other player)
     */
    markActionAsTaken(): void {
        if(this.currentActionWindow) {
            this.currentActionWindow.markActionAsTaken();
        }
    }

    /*
     * Resolves a card ability or ring effect
     */
    resolveAbility(context: AbilityContext): AbilityResolver {
        const resolver = new AbilityResolver(this, context);
        this.queueStep(resolver);
        return resolver;
    }

    openSimultaneousEffectWindow(choices: any[]): void {
        const window = new SimultaneousEffectWindow(this);
        choices.forEach((choice) => window.addChoice(choice));
        this.queueStep(window);
    }

    getEvent(eventName: string, params?: any, handler?: (event: any) => any): Event {
        return new Event(eventName, params, handler);
    }

    /**
     * Creates a game Event, and opens a window for it.
     */
    raiseEvent(eventName: string, params: any = {}, handler: (event?: any) => any = () => true): Event {
        const event = this.getEvent(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }

    emitEvent(eventName: string, params: any = {}): void {
        const event = this.getEvent(eventName, params);
        this.emit(event.name, event);
    }

    /**
     * Creates an EventWindow which will open windows for each kind of triggered
     * ability which can respond any passed events, and execute their handlers.
     */
    openEventWindow(events: Event | Event[]): EventWindow {
        if(!Array.isArray(events)) {
            events = [events];
        }
        return this.queueStep(new EventWindow(this, events));
    }

    openThenEventWindow(events: Event | Event[]): EventWindow | ThenEventWindow {
        if(this.currentEventWindow) {
            if(!Array.isArray(events)) {
                events = [events];
            }
            return this.queueStep(new ThenEventWindow(this, events));
        }
        return this.openEventWindow(events);
    }

    /**
     * Raises a custom event window for checking for any cancels to a card
     * ability
     */
    raiseInitiateAbilityEvent(params: any, handler: () => any): void {
        this.raiseMultipleInitiateAbilityEvents([{ params: params, handler: handler }]);
    }

    /**
     * Raises a custom event window for checking for any cancels to several card
     * abilities which initiate simultaneously
     */
    raiseMultipleInitiateAbilityEvents(eventProps: Array<{ params: any; handler: () => any }>): void {
        const events = eventProps.map((event) => new InitiateCardAbilityEvent(event.params, event.handler));
        this.queueStep(new InitiateAbilityEventWindow(this, events));
    }

    /**
     * Checks whether a game action can be performed on a card or an array of
     * cards, and performs it on all legal targets.
     */
    applyGameAction(context: AbilityContext | null, actions: Record<string, any>): Event[] {
        if(!context) {
            context = this.getFrameworkContext();
        }
        const resolvedContext = context;
        const actionPairs = Object.entries(actions);
        const events = actionPairs.reduce((array: Event[], [action, cards]) => {
            action = action === 'break' ? 'breakProvince' : action;
            const gameActionFactory = (GameActions as any)[action];
            if(typeof gameActionFactory === 'function') {
                const gameAction = gameActionFactory({ target: cards });
                gameAction.addEventsToArray(array, resolvedContext);
            }
            return array;
        }, []);
        if(events.length > 0) {
            this.openEventWindow(events);
            this.queueSimpleStep(() => resolvedContext.refill());
        }
        return events;
    }

    getFrameworkContext(player: Player | null = null): AbilityContext {
        return new AbilityContext({ game: this, player: player });
    }

    initiateConflict(
        player: Player,
        canPass: boolean,
        forcedDeclaredType?: ConflictTypes | string,
        forceProvinceTarget?: any
    ): void {
        const conflict = new Conflict(
            this,
            player,
            player.opponent,
            null,
            forceProvinceTarget ?? null,
            forcedDeclaredType as ConflictTypes
        );
        this.queueStep(new ConflictFlow(this, conflict, canPass));
    }

    updateCurrentConflict(conflict: any): void {
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
            !card.checkRestrictions(EffectNames.TakeControl, this.getFrameworkContext())
        ) {
            return;
        }
        if(!player || !player.cardsInPlay) {
            return;
        }
        card.controller.removeCardFromPile(card);
        player.cardsInPlay.push(card);
        card.controller = player;
        if(card.isParticipating()) {
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

    getFavorSide(): string | undefined {
        for(const player of this.getPlayers()) {
            if(player.imperialFavor) {
                return player.imperialFavor;
            }
        }
        return undefined;
    }

    watch(socketId: string, user: any): boolean {
        if(!this.allowSpectators) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);
        this.invalidatePlayerCaches();
        this.addMessage('{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId: string, user: any): boolean {
        if(this.started || this.getPlayers().length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(socketId, user, this.owner === user.username, this);
        this.invalidatePlayerCaches();

        return true;
    }

    isEmpty(): boolean {
        return Object.values(this.playersAndSpectators).every(
            (player) => player.disconnected || player.left || player.id === 'TBA'
        );
    }

    allPlayersGone(): boolean {
        return this.started && this.getPlayers().every(
            (player) => player.disconnected || player.left
        );
    }

    leave(playerName: string): void {
        const player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} has left the game', playerName);

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
            this.invalidatePlayerCaches();
        } else {
            player.left = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName: string): void {
        const player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} has disconnected', player);

        if(this.isSpectator(player)) {
            delete this.playersAndSpectators[playerName];
            this.invalidatePlayerCaches();
        } else {
            player.disconnected = true;
        }

        player.socket = undefined;
    }

    failedConnect(playerName: string): void {
        const player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
            this.invalidatePlayerCaches();
        } else {
            this.addMessage('{0} has failed to connect to the game', player);

            player.disconnected = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket: any, playerName: string): void {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnected = false;

        this.addMessage('{0} has reconnected', player);
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
                    card.checkForIllegalAttachments();
                });
                player.getProvinces().forEach((card: any) => {
                    if(card) {
                        card.checkForIllegalAttachments();
                    }
                });

                if(!player.checkRestrictions('haveImperialFavor') && player.imperialFavor !== '') {
                    this.addMessage('The imperial favor is discarded as {0} cannot have it', player.name);
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

    formatDeckForSaving(deck: any): any {
        const result: any = {
            faction: {},
            conflictCards: [],
            dynastyCards: [],
            provinceCards: [],
            stronghold: undefined,
            role: undefined
        };

        //faction
        result.faction = deck.faction;

        //conflict
        deck.conflictCards.forEach((cardData: any) => {
            if(cardData && cardData.card) {
                result.conflictCards.push(`${cardData.count}x ${cardData.card.id}`);
            }
        });

        //dynasty
        deck.dynastyCards.forEach((cardData: any) => {
            if(cardData && cardData.card) {
                result.dynastyCards.push(`${cardData.count}x ${cardData.card.id}`);
            }
        });

        //provinces
        if(deck.provinceCards) {
            deck.provinceCards.forEach((cardData: any) => {
                if(cardData && cardData.card) {
                    result.provinceCards.push(cardData.card.id);
                }
            });
        }

        //stronghold & role
        if(deck.stronghold) {
            deck.stronghold.forEach((cardData: any) => {
                if(cardData && cardData.card) {
                    result.stronghold = cardData.card.id;
                }
            });
        }
        if(deck.role) {
            deck.role.forEach((cardData: any) => {
                if(cardData && cardData.card) {
                    result.role = cardData.card.id;
                }
            });
        }

        return result;
    }

    /*
     * This information is all logged when a game is won
     */
    getSaveState(): any {
        const players = this.getPlayers().map((player) => ({
            name: player.name,
            faction: player.faction.name || player.faction.value,
            honor: player.getTotalHonor(),
            lostProvinces: player
                .getProvinceCards()
                .reduce((count: number, card: any) => (card && card.isBroken ? count + 1 : count), 0),
            deck: this.formatDeckForSaving(player.deck),
            deckId: player.deck?._id?.toString()
        }));

        return {
            id: this.savedGameId,
            gameId: this.id,
            startedAt: this.startedAt,
            players: players,
            winner: this.winner ? this.winner.name : undefined,
            winReason: this.winReason,
            gameMode: this.gameMode,
            finishedAt: this.finishedAt,
            roundNumber: this.roundNumber,
            initialFirstPlayer: this.initialFirstPlayer
        };
    }

    /*
     * This information is sent to the client
     */
    /**
     * Pre-compute state shared across all viewers (conflict, messages, spectators, metadata).
     * Pass the result to getState() to avoid redundant work when sending to multiple clients.
     */
    getSharedState(): any {
        if(!this.started) {
            return null;
        }

        let conflictState: any = {};
        if(this.currentPhase === 'conflict' && this.currentConflict) {
            conflictState = this.currentConflict.getSummary();
        }

        const { blocklist: _blocklist, email: _email, emailHash: _emailHash, promptedActionWindows: _promptedActionWindows, settings: _settings, ...ownerSummary } = this.owner;
        return {
            id: this.id,
            manualMode: this.manualMode,
            name: this.name,
            owner: ownerSummary,
            conflict: conflictState,
            phase: this.currentPhase,
            spectators: this.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            }),
            started: this.started,
            gameMode: this.gameMode,
            winner: this.winner ? this.winner.name : undefined,
            animations: this.pendingAnimations.slice()
        };
    }

    getState(activePlayerName?: string, sharedState?: any): any {
        const activePlayer = (activePlayerName && this.playersAndSpectators[activePlayerName]) || new AnonymousSpectator();

        if(!this.started) {
            return this.getSummary(activePlayerName);
        }

        const shared = sharedState || this.getSharedState();

        const playerState: Record<string, any> = {};
        const ringState: Record<string, any> = {};

        for(const player of this.getPlayers()) {
            playerState[player.name] = player.getState(activePlayer as Player);
        }

        Object.values(this.rings).forEach((ring) => {
            ringState[ring.element] = ring.getState(activePlayer as Player);
        });

        return Object.assign({}, shared, {
            players: playerState,
            rings: ringState,
            messages: this.gameChat.messages
        });
    }

    /**
     * Build a snapshot of hidden card identities (hands + facedown provinces) for replay enrichment.
     * Called each time game state is sent so the log can be merged into the client replay at game end.
     */
    getHiddenInfoFingerprint(): string {
        const parts: string[] = [];
        for(const player of this.getPlayers()) {
            parts.push(player.name);
            parts.push(player.hand.map((c: any) => c.uuid).join(','));
            parts.push(player.strongholdProvince.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceOne.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceTwo.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceThree.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceFour.map((c: any) => c.uuid).join(','));
            parts.push(player.stronghold ? player.stronghold.childCards.map((c: any) => c.uuid).join(',') : '');
        }
        return parts.join('|');
    }

    recordHiddenInfoIfChanged(): void {
        const fingerprint = this.getHiddenInfoFingerprint();
        if(fingerprint === this.lastHiddenInfoFingerprint && this.hiddenInfoLog.length > 0) {
            this.hiddenInfoLog.push(this.hiddenInfoLog[this.hiddenInfoLog.length - 1]);
            return;
        }
        this.lastHiddenInfoFingerprint = fingerprint;
        this.hiddenInfoLog.push(this.getHiddenInfo());
    }

    getHiddenInfo(): any {
        const info: Record<string, any> = {};
        for(const player of this.getPlayers()) {
            const cardSummary = (card: any) => ({
                id: card.cardData.id,
                name: card.cardData.name,
                packId: card.packId,
                type: card.getType(),
                uuid: card.uuid
            });
            info[player.name] = {
                hand: player.hand.map(cardSummary),
                provinces: {
                    stronghold: player.strongholdProvince.map(cardSummary),
                    one: player.provinceOne.map(cardSummary),
                    two: player.provinceTwo.map(cardSummary),
                    three: player.provinceThree.map(cardSummary),
                    four: player.provinceFour.map(cardSummary)
                },
                strongholdChildren: player.stronghold ? player.stronghold.childCards.map(cardSummary) : []
            };
        }
        return info;
    }

    /*
     * This is used for debugging?
     */
    getSummary(activePlayerName?: string): any {
        const playerSummaries: Record<string, any> = {};

        for(const player of this.getPlayers()) {
            let deck: any = undefined;
            if(player.left) {
                return;
            }

            if(activePlayerName === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                deck: deck,
                emailHash: player.emailHash,
                faction: player.faction.value,
                id: player.id,
                lobbyId: player.lobbyId,
                left: player.left,
                name: player.name,
                owner: player.owner
            };
        }

        const { blocklist: _blocklist2, email: _email2, emailHash: _emailHash2, promptedActionWindows: _promptedActionWindows2, settings: _settings2, ...ownerSummary } = this.owner;
        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameType: this.gameType,
            id: this.id,
            manualMode: this.manualMode,
            messages: this.gameChat.messages,
            name: this.name,
            owner: ownerSummary,
            players: playerSummaries,
            started: this.started,
            startedAt: this.startedAt,
            gameMode: this.gameMode,
            spectators: this.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            })
        };
    }
}

export = Game;
