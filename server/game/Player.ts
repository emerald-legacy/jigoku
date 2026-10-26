import { msg } from './GameChat.js';
import { isEnumValue } from './utils/helpers.js';
import { shuffle } from './utils/random.js';
import { HonorTracker } from './HonorTracker.js';
import { PlayerZones, type AdditionalPile, type DrawCardPile } from './PlayerZones.js';

import { GameObject } from './GameObject.js';
import { Deck } from './Deck.js';
import { clockFor, type ClockConfig } from './Clocks/ClockSelector.js';
import type { CostReducer, CostReducerProps } from './CostReducer.js';
import type { AbilityLimit } from './AbilityLimit.js';
import { attach, loseHonor } from './GameActions/GameActions.js';
import { RingAbilities } from './RingAbilities.js';
import type { PlayableLocation } from './PlayableLocation.js';
import { PlayerCostManager } from './PlayerCostManager.js';
import { PlayerConflictManager, type ConflictDeclarationProperties } from './PlayerConflictManager.js';
import { PlayerStateBuilder } from './PlayerStateBuilder.js';
import { PlayerPromptState } from './PlayerPromptState.js';
import type { RoleCard } from './RoleCard.js';
import { StrongholdCard } from './StrongholdCard.js';

import {
    type ActionWindowName,
    CardType,
    type ConflictType,
    DeckType,
    EffectName,
    type Element,
    EventName,
    FavorType,
    Location,
    ObjectType,
    type Phase,
    Players,
    type PlayType,
    RestrictionType,
    Trait
} from './Constants.js';
import type Game from './Game.js';
import type { Socket } from '../Socket.js';
import type BaseCard from './BaseCard.js';
import type { CardSummary } from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Ring from './Ring.js';
import type { ClockInterface } from './Clocks/types.js';
import { AbilityContext } from './AbilityContext.js';
import type { DeckDTO } from '../gamenode/LobbyProtocol.js';
import type { FatePool } from './Effects/EffectValueMap.js';
import type { StateViewer } from './types/StateViewer.js';

export interface PlayerState extends Partial<ReturnType<PlayerPromptState['getState']>> {
    cardPiles: { [pile: string]: CardSummary[] };
    cardsPlayedThisConflict: number;
    disconnected: boolean;
    faction: DeckFaction;
    firstPlayer: boolean;
    hideProvinceDeck: boolean;
    id: string;
    imperialFavor: FavorType | '';
    left: boolean;
    name: string;
    numConflictCards: number;
    numDynastyCards: number;
    numProvinceCards: number;
    optionSettings: OptionSettings;
    phase: string;
    promptedActionWindows: Partial<Record<ActionWindowName, boolean>>;
    provinces: { one: CardSummary[]; two: CardSummary[]; three: CardSummary[]; four: CardSummary[] };
    showBid: number;
    stats: ReturnType<PlayerStateBuilder['getStats']>;
    timerSettings: TimerSettings;
    strongholdProvince: CardSummary[];
    user: {
        username: string;
        emailHash?: string;
        settings?: GamePlayerUserSettings;
    };
    showConflictDeck?: boolean;
    showDynastyDeck?: boolean;
    role?: CardSummary;
    stronghold?: CardSummary;
    conflictDeckTopCard?: CardSummary | ({ facedown: true } & ReturnType<PlayerPromptState['getCardSelectionState']>);
    dynastyDeckTopCard?: CardSummary | ({ facedown: true } & ReturnType<PlayerPromptState['getCardSelectionState']>);
    clock?: ReturnType<ClockInterface['getState']>;
}

interface OptionSettings {
    markCardsUnselectable?: boolean;
    cancelOwnAbilities?: boolean;
    orderForcedAbilities?: boolean;
    confirmOneClick?: boolean;
    disableCardStats?: boolean;
    showStatusInSidebar?: boolean;
    sortHandByName?: boolean;
    showRingEffects?: boolean;
    [key: string]: boolean | undefined;
}

interface TimerSettings {
    events?: boolean;
    eventsInDeck?: boolean;
    windowTimer?: number | string;
    [key: string]: boolean | number | string | undefined;
}

interface DeckFaction {
    name?: string;
    value?: string;
}

interface MoveCardOptions {
    bottom?: boolean;
    /** For `Location.Underneath`: the card it goes under. */
    host?: BaseCard;
}

interface PatronSettings {
    dial?: string;
    tokens?: string;
    rings?: string;
    usePromos?: boolean;
}

export interface GamePlayerUserSettings {
    cardSize?: string;
    disableGravatar?: boolean;
    windowTimer?: number | string;
    background?: string;
    optionSettings?: OptionSettings;
    timerSettings?: TimerSettings;
    patron?: PatronSettings;
}

export interface GamePlayerUser {
    username: string;
    emailHash?: string;
    promptedActionWindows?: Record<string, boolean>;
    settings?: GamePlayerUserSettings;
}

export class Player extends GameObject {
    user: GamePlayerUser;
    emailHash: string;
    declare id: string;
    owner: boolean;
    declare printedType: ObjectType;
    socket: Socket | null | undefined;
    disconnected: boolean;
    left: boolean;

    readonly zones: PlayerZones = new PlayerZones();

    faction: DeckFaction;
    stronghold: StrongholdCard | null;
    role: RoleCard | null;

    hideProvinceDeck: boolean;
    takenDynastyMulligan: boolean;
    takenConflictMulligan: boolean;
    passedDynasty: boolean;
    actionPhasePriority: boolean;
    honorBidModifier: number;
    showBid: number;
    conflictManager: PlayerConflictManager;
    stateBuilder: PlayerStateBuilder;
    imperialFavor: FavorType | '';

    clock: ClockInterface;

    limitedPlayed: number;
    deck: DeckDTO;
    costManager: PlayerCostManager;
    abilityMaxByIdentifier: Record<string, AbilityLimit>;
    promptedActionWindows: Partial<Record<ActionWindowName, boolean>>;
    timerSettings: TimerSettings;
    optionSettings: OptionSettings;
    resetTimerAtEndOfRound: boolean;
    private honorTracker: HonorTracker = new HonorTracker();

    promptState: PlayerPromptState;
    opponent?: Player;
    preparedDeck!: ReturnType<Deck['prepare']>;
    outsideTheGameCards!: DrawCard[];
    fate: number = 0;
    readyToStart: boolean = false;
    maxLimited: number = 1;
    firstPlayer: boolean = false;
    showConflict: boolean = false;
    showDynasty: boolean = false;
    noTimer: boolean = false;

    override isPlayer(): this is Player {
        return true;
    }

    constructor(id: string, user: GamePlayerUser, owner: boolean, game: Game, clockdetails?: ClockConfig) {
        super(game, user.username);
        this.user = user;
        this.emailHash = this.user.emailHash ?? '';
        this.id = id;
        this.owner = owner;
        this.printedType = ObjectType.Player;
        this.socket = null;
        this.disconnected = false;
        this.left = false;

        this.faction = {};
        this.stronghold = null;
        this.role = null;

        this.hideProvinceDeck = false;
        this.takenDynastyMulligan = false;
        this.takenConflictMulligan = false;
        this.passedDynasty = false;
        this.actionPhasePriority = false;
        this.honorBidModifier = 0;
        this.showBid = 0;
        this.conflictManager = new PlayerConflictManager(this, this.game);
        this.stateBuilder = new PlayerStateBuilder(this, this.game);
        this.imperialFavor = '';

        this.clock = clockFor(this, clockdetails);

        this.limitedPlayed = 0;
        this.deck = {};
        this.costManager = new PlayerCostManager(this, this.game);
        this.abilityMaxByIdentifier = {};
        this.promptedActionWindows = user.promptedActionWindows || {
            dynasty: true,
            draw: true,
            preConflict: true,
            conflict: true,
            fate: true
        };
        const settings = user.settings ?? {};
        this.timerSettings = settings.timerSettings ?? {};
        this.timerSettings.windowTimer = settings.windowTimer;
        this.optionSettings = settings.optionSettings ?? {};
        this.resetTimerAtEndOfRound = false;
        this.promptState = new PlayerPromptState(this);
    }

    get honor(): number {
        return this.honorTracker.honor;
    }

    set honor(value: number) {
        this.honorTracker.honor = value;
    }

    get selectedCards(): BaseCard[] {
        return this.promptState.selectedCards ?? [];
    }

    get dynastyDeck(): DrawCard[] {
        return this.zones.dynastyDeck;
    }
    set dynastyDeck(v: DrawCard[]) {
        this.zones.dynastyDeck = v;
    }

    get conflictDeck(): DrawCard[] {
        return this.zones.conflictDeck;
    }
    set conflictDeck(v: DrawCard[]) {
        this.zones.conflictDeck = v;
    }

    get provinceDeck(): ProvinceCard[] {
        return this.zones.provinceDeck;
    }
    set provinceDeck(v: ProvinceCard[]) {
        this.zones.provinceDeck = v;
    }

    get hand(): DrawCard[] {
        return this.zones.hand;
    }
    set hand(v: DrawCard[]) {
        this.zones.hand = v;
    }

    get cardsInPlay(): DrawCard[] {
        return this.zones.cardsInPlay;
    }
    set cardsInPlay(v: DrawCard[]) {
        this.zones.cardsInPlay = v;
    }

    get strongholdProvince(): BaseCard[] {
        return this.zones.strongholdProvince;
    }
    set strongholdProvince(v: BaseCard[]) {
        this.zones.strongholdProvince = v;
    }

    get provinceOne(): BaseCard[] {
        return this.zones.provinceOne;
    }
    set provinceOne(v: BaseCard[]) {
        this.zones.provinceOne = v;
    }

    get provinceTwo(): BaseCard[] {
        return this.zones.provinceTwo;
    }
    set provinceTwo(v: BaseCard[]) {
        this.zones.provinceTwo = v;
    }

    get provinceThree(): BaseCard[] {
        return this.zones.provinceThree;
    }
    set provinceThree(v: BaseCard[]) {
        this.zones.provinceThree = v;
    }

    get provinceFour(): BaseCard[] {
        return this.zones.provinceFour;
    }
    set provinceFour(v: BaseCard[]) {
        this.zones.provinceFour = v;
    }

    get dynastyDiscardPile(): DrawCard[] {
        return this.zones.dynastyDiscardPile;
    }
    set dynastyDiscardPile(v: DrawCard[]) {
        this.zones.dynastyDiscardPile = v;
    }

    get conflictDiscardPile(): DrawCard[] {
        return this.zones.conflictDiscardPile;
    }
    set conflictDiscardPile(v: DrawCard[]) {
        this.zones.conflictDiscardPile = v;
    }

    get removedFromGame(): BaseCard[] {
        return this.zones.removedFromGame;
    }
    set removedFromGame(v: BaseCard[]) {
        this.zones.removedFromGame = v;
    }

    get additionalPiles(): Record<string, AdditionalPile> {
        return this.zones.additionalPiles;
    }
    set additionalPiles(v: Record<string, AdditionalPile>) {
        this.zones.additionalPiles = v;
    }

    get underneathStronghold(): BaseCard[] {
        return this.zones.underneathStronghold;
    }
    set underneathStronghold(v: BaseCard[]) {
        this.zones.underneathStronghold = v;
    }

    getSourceList(source: DrawCardPile): DrawCard[];
    getSourceList(source: Location.ProvinceDeck): ProvinceCard[];
    getSourceList(source: string): BaseCard[];
    getSourceList(source: string): BaseCard[] {
        return this.zones.getSourceList(source);
    }

    getDynastyCardInProvince(location: Location): DrawCard | undefined {
        return this.zones.getDynastyCardInProvince(location);
    }

    getDynastyCardsInProvince(location: Location): DrawCard[] {
        return this.zones.getDynastyCardsInProvince(location);
    }

    getProvinceCardInProvince(location: Location): ProvinceCard | undefined {
        return this.zones.getProvinceCardInProvince(location);
    }

    startClock(): void {
        this.clock.start();
        if(this.opponent) {
            this.opponent.clock.opponentStart();
        }
    }

    stopNonChessClocks(): void {
        if(this.clock.name !== 'Chess Clock') {
            this.stopClock();
        }
    }

    stopClock(): void {
        this.clock.stop();
    }

    resetClock(): void {
        this.clock.reset();
    }

    removeCardByUuid(list: BaseCard[], uuid: string): BaseCard[] {
        return list.filter((card) => {
            return card.uuid !== uuid;
        });
    }

    findCardByName(list: BaseCard[], name: string): BaseCard | undefined {
        return this.findCard(list, (card) => card.name === name);
    }

    findCardByUuid(list: BaseCard[], uuid: string): BaseCard | undefined {
        return this.findCard(list, (card) => card.uuid === uuid);
    }

    findCardInPlayByUuid(uuid: string): DrawCard | undefined {
        return this.findCard(this.cardsInPlay, (card) => card.uuid === uuid);
    }

    /** The first matching card in the list, or attached to a card in it. */
    findCard<Card extends BaseCard>(cardList: Card[], predicate: (card: Card | DrawCard) => boolean): Card | DrawCard | undefined {
        const cards = this.findCards(cardList, predicate);
        if(!cards || cards.length === 0) {
            return undefined;
        }

        return cards[0];
    }

    findCards<Card extends BaseCard>(cardList: Card[], predicate: (card: Card | DrawCard) => boolean): Array<Card | DrawCard> {
        if(!cardList) {
            return [];
        }

        const cardsToReturn: Array<Card | DrawCard> = [];

        for(const card of cardList) {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            const attachments = card.attachments;
            if(attachments) {
                cardsToReturn.push(...attachments.filter(predicate));
            }
        }

        return cardsToReturn;
    }

    isTraitInPlay(trait: Trait): boolean {
        return this.game.allCards.some((card: BaseCard) => {
            return (
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Location.PlayArea ||
                    (card.isProvinceCard() && !card.isBroken) ||
                    (card.isInProvince() && card.type === CardType.Holding))
            );
        });
    }

    isCharacterTraitInPlay(trait: Trait): boolean {
        return this.game.allCards.some((card: BaseCard) => {
            return (
                card.type === CardType.Character &&
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                card.location === Location.PlayArea
            );
        });
    }

    areLocationsAdjacent(locationA: Location, locationB: Location): boolean {
        switch(locationA) {
            case Location.ProvinceOne:
                return locationB === Location.ProvinceTwo;
            case Location.ProvinceTwo:
                return locationB === Location.ProvinceOne || locationB === Location.ProvinceThree;
            case Location.ProvinceThree:
                return locationB === Location.ProvinceTwo || locationB === Location.ProvinceFour;
            case Location.ProvinceFour:
                return locationB === Location.ProvinceThree;
            default:
                return false;
        }
    }

    getProvinceCards(): ProvinceCard[] {
        const locations = this.game.getProvinceArray();
        return locations.flatMap((location) => this.getProvinceCardInProvince(location) ?? []);
    }

    anyCardsInPlay(predicate: (card: DrawCard) => boolean): boolean {
        return this.game.allCards.some(
            (card) => card.controller === this && card.location === Location.PlayArea && card.isDrawCard() && predicate(card)
        );
    }

    getAllConflictCards(predicate: (card: DrawCard) => boolean = () => true): DrawCard[] {
        return this.game.allCards.filter(
            (card): card is DrawCard => card.owner === this && card.isConflictCard() && predicate(card)
        );
    }

    filterCardsInPlay(predicate: (card: DrawCard) => boolean): DrawCard[] {
        return this.game.allCards.filter(
            (card): card is DrawCard => card.controller === this && card.location === Location.PlayArea && card.isDrawCard() && predicate(card)
        );
    }

    hasComposure(): boolean {
        return this.opponent !== undefined && this.opponent.showBid > this.showBid;
    }

    hasLegalConflictDeclaration(properties: ConflictDeclarationProperties): boolean {
        return this.conflictManager.hasLegalConflictDeclaration(properties);
    }

    getConflictOpportunities(): number {
        return this.conflictManager.getConflictOpportunities();
    }

    getRemainingConflictOpportunitiesForType(type: ConflictType): number {
        return this.conflictManager.getRemainingConflictOpportunitiesForType(type);
    }

    getLegalConflictTypes(properties: ConflictDeclarationProperties): ConflictType[] {
        return this.conflictManager.getLegalConflictTypes(properties);
    }

    get declaredConflictOpportunities(): Record<ConflictType, number> {
        return this.conflictManager.declaredConflictOpportunities;
    }

    get defaultAllowedConflicts(): Record<ConflictType, number> {
        return this.conflictManager.defaultAllowedConflicts;
    }

    getProvinces(predicate: (card: ProvinceCard) => boolean = () => true): ProvinceCard[] {
        return this.game
            .getProvinceArray()
            .reduce(
                (array: ProvinceCard[], location: Location) =>
                    array.concat(
                        this.getSourceList(location).filter(
                            (card): card is ProvinceCard => card.type === CardType.Province && card.isProvinceCard() && predicate(card)
                        )
                    ),
                []
            );
    }

    getNumberOfFaceupProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return this.getProvinces((card) => card.isFaceup() && predicate(card)).length;
    }

    getNumberOfOpponentsFaceupProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return (this.opponent && this.opponent.getNumberOfFaceupProvinces(predicate)) || 0;
    }

    getNumberOfFacedownProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return this.getProvinces((card) => card.isFacedown() && predicate(card)).length;
    }

    getNumberOfOpponentsFacedownProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return (this.opponent && this.opponent.getNumberOfFacedownProvinces(predicate)) || 0;
    }

    getNumberOfCardsInPlay(predicate: (card: DrawCard) => boolean): number {
        return this.game.allCards.reduce((num: number, card) => {
            if(card.controller === this && card.location === Location.PlayArea && card.isDrawCard() && predicate(card)) {
                return num + 1;
            }
            return num;
        }, 0);
    }

    getNumberOfHoldingsInPlay(): number {
        return this.getHoldingsInPlay().length;
    }

    getHoldingsInPlay(): BaseCard[] {
        return this.game
            .getProvinceArray()
            .reduce(
                (array: BaseCard[], province: Location) =>
                    array.concat(
                        this.getSourceList(province).filter(
                            (card) => card.getType() === CardType.Holding && card.isFaceup()
                        )
                    ),
                []
            );
    }

    isCardInPlayableLocation(card: BaseCard, playingType: PlayType | null = null): boolean {
        return this.costManager.isCardInPlayableLocation(card, playingType);
    }

    findPlayType(card: BaseCard): PlayType | undefined {
        return this.costManager.findPlayType(card);
    }

    getDuplicateInPlay(card: DrawCard): DrawCard | undefined {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, (playCard) => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        });
    }

    drawCardsToHand(numCards: number): void {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.length) {
            remainingCards = numCards - this.conflictDeck.length;
            const cards = this.conflictDeck.slice();
            this.deckRanOutOfCards(DeckType.Conflict);
            this.game.queueSimpleStep(() => {
                for(const card of cards) {
                    this.moveCard(card, Location.Hand);
                }
            });
            this.game.queueSimpleStep(() => {
                if(this.conflictDeck.length > 0) {
                    this.drawCardsToHand(remainingCards);
                }
            });
        } else {
            for(const card of this.conflictDeck.slice(0, numCards)) {
                this.moveCard(card, Location.Hand);
            }
        }
    }

    deckRanOutOfCards(deck: DeckType): void {
        const [deckLocation, discardLocation] = deck === DeckType.Dynasty
            ? [Location.DynastyDeck, Location.DynastyDiscardPile]
            : [Location.ConflictDeck, Location.ConflictDiscardPile];
        const action = loseHonor({ amount: this.game.rules.deckoutHonorLoss });
        if(action.canAffect(this, this.game.getFrameworkContext(this))) {
            this.game.addMessage(msg`${this}'s ${deck} has run out of cards, so they lose ${this.game.rules.deckoutHonorLoss} honor`);
        } else {
            this.game.addMessage(msg`${this}'s ${deck} has run out of cards`);
        }
        action.resolve(this, this.game.getFrameworkContext(this));
        this.game.queueSimpleStep(() => {
            this.getSourceList(discardLocation).forEach((card: BaseCard) => this.moveCard(card, deckLocation));
            this.shuffleDeck(deckLocation);
        });
    }

    replaceDynastyCard(location: Location): boolean {
        const province = this.getProvinceCardInProvince(location);

        if(!province || this.getSourceList(location).length > 1) {
            return false;
        }
        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards(DeckType.Dynasty);
            this.game.queueSimpleStep(() => {
                if(this.dynastyDeck.length > 0) {
                    this.replaceDynastyCard(location);
                }
            });
        } else {
            let refillAmount = 1;
            if(province) {
                const amount = province.mostRecentEffect(EffectName.RefillProvinceTo);
                if(amount) {
                    refillAmount = amount;
                }
            }

            this.refillProvince(location, refillAmount);
        }
        return true;
    }

    putTopDynastyCardInProvince(location: Location, facedown: boolean = false): boolean {
        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards(DeckType.Dynasty);
            this.game.queueSimpleStep(() => {
                if(this.dynastyDeck.length > 0) {
                    this.putTopDynastyCardInProvince(location, facedown);
                }
            });
        } else {
            const cardFromDeck = this.dynastyDeck[0];
            this.moveCard(cardFromDeck, location);
            cardFromDeck.facedown = facedown;
            return true;
        }
        return true;
    }

    refillProvince(location: Location, refillAmount: number): boolean {
        if(refillAmount <= 0) {
            return true;
        }

        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards(DeckType.Dynasty);
            this.game.queueSimpleStep(() => {
                if(this.dynastyDeck.length > 0) {
                    this.refillProvince(location, refillAmount);
                }
            });
            return true;
        }
        const province = this.getProvinceCardInProvince(location);
        const refillFunc = province?.mostRecentEffect(EffectName.CustomProvinceRefillEffect);
        if(province && refillFunc) {
            refillFunc(this, province);
        } else {
            this.moveCard(this.dynastyDeck[0], location);
        }

        this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount - 1));
        return true;
    }

    shuffleConflictDeck(): void {
        this.game.addMessage(msg`${this} is shuffling their conflict deck`);
        this.game.emitEvent(EventName.OnDeckShuffled, { player: this, deck: DeckType.Conflict });
        this.conflictDeck = shuffle(this.conflictDeck);
    }

    shuffleDynastyDeck(): void {
        this.game.addMessage(msg`${this} is shuffling their dynasty deck`);
        this.game.emitEvent(EventName.OnDeckShuffled, { player: this, deck: DeckType.Dynasty });
        this.dynastyDeck = shuffle(this.dynastyDeck);
    }

    /** Shuffles the deck at `location`; any other location does nothing. */
    shuffleDeck(location: Location): void {
        if(location === Location.ConflictDeck) {
            this.shuffleConflictDeck();
        } else if(location === Location.DynastyDeck) {
            this.shuffleDynastyDeck();
        }
    }

    prepareDecks(): void {
        const deck = new Deck(this.deck);
        const preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction ?? {};
        this.provinceDeck = preparedDeck.provinceCards;
        if(preparedDeck.stronghold) {
            this.stronghold = preparedDeck.stronghold;
        }
        if(preparedDeck.role) {
            this.role = preparedDeck.role;
        }
        this.conflictDeck = preparedDeck.conflictCards;
        this.dynastyDeck = preparedDeck.dynastyCards;
        this.preparedDeck = preparedDeck;
        this.conflictDeck.forEach((card: DrawCard) => {
            if(card.type === CardType.Event) {
                for(const reaction of card.abilities.reactions) {
                    reaction.registerEvents();
                }
            }
        });
        this.outsideTheGameCards = preparedDeck.outsideTheGameCards;
    }

    initialise(): void {
        this.opponent = this.game.getOtherPlayer(this);

        this.prepareDecks();
        this.shuffleConflictDeck();
        this.shuffleDynastyDeck();

        this.fate = 0;
        this.honor = 0;
        this.readyToStart = false;
        this.maxLimited = 1;
        this.firstPlayer = false;
    }

    addCostReducer(source: BaseCard, properties: CostReducerProps): CostReducer {
        return this.costManager.addCostReducer(source, properties);
    }

    removeCostReducer(reducer: CostReducer): void {
        this.costManager.removeCostReducer(reducer);
    }

    addPlayableLocation(type: PlayType, player: Player, location: Location, cards: DrawCard[] = []): PlayableLocation {
        return this.costManager.addPlayableLocation(type, player, location, cards);
    }

    removePlayableLocation(location: PlayableLocation): void {
        this.costManager.removePlayableLocation(location);
    }

    getAlternateFatePools(card: BaseCard, context?: AbilityContext): FatePool[] {
        return this.costManager.getAlternateFatePools(card, context);
    }

    getMinimumCost(playingType: PlayType | undefined, context: AbilityContext<DrawCard>, target?: BaseCard, ignoreType: boolean = false): number {
        return this.costManager.getMinimumCost(playingType, context, target, ignoreType);
    }

    getReducedCost(playingType: PlayType | undefined, card: DrawCard, target?: BaseCard, ignoreType: boolean = false): number {
        return this.costManager.getReducedCost(playingType, card, target, ignoreType);
    }

    getTotalCostModifiers(playingType: PlayType | undefined, card: DrawCard, target?: BaseCard, ignoreType: boolean = false): number {
        return this.costManager.getTotalCostModifiers(playingType, card, target, ignoreType);
    }

    getAvailableAlternateFate(context: AbilityContext): number {
        return this.costManager.getAvailableAlternateFate(context);
    }

    getTargetingCost(abilitySource: BaseCard, targets: GameObject | GameObject[]): number {
        return this.costManager.getTargetingCost(abilitySource, targets);
    }

    markUsedReducers(playingType: PlayType | undefined, card: DrawCard, target?: BaseCard, ignoreType = false): void {
        this.costManager.markUsedReducers(playingType, card, target, ignoreType);
    }

    get costReducers(): CostReducer[] {
        return this.costManager.costReducers;
    }

    get playableLocations(): PlayableLocation[] {
        return this.costManager.playableLocations;
    }

    registerAbilityMax(maxIdentifier: string, limit: AbilityLimit): void {
        if(this.abilityMaxByIdentifier[maxIdentifier]) {
            return;
        }

        this.abilityMaxByIdentifier[maxIdentifier] = limit;
        limit.registerEvents(this.game);
    }

    isAbilityAtMax(maxIdentifier: string): boolean {
        const limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(!limit) {
            return false;
        }

        return limit.isAtMax(this);
    }

    incrementAbilityMax(maxIdentifier: string): void {
        const limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(limit) {
            limit.increment(this);
        }
    }

    beginDynasty(): void {
        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.resetConflictOpportunities();

        this.cardsInPlay.forEach((card: DrawCard) => {
            card.new = false;
        });
        this.passedDynasty = false;
    }

    collectFate(): void {
        this.modifyFate(this.getTotalIncome());
        this.game.raiseEvent(EventName.OnFateCollected, { player: this });
    }

    resetConflictOpportunities(): void {
        this.conflictManager.resetConflictOpportunities();
    }

    showConflictDeck(): void {
        this.showConflict = true;
    }

    showDynastyDeck(): void {
        this.showDynasty = true;
    }


    drop(cardId: string, source: string, target: string): void {
        const sourceList = this.getSourceList(source);
        const card = this.findCardByUuid(sourceList, cardId);

        if(
            !this.game.manualMode ||
            !isEnumValue(Location, target) ||
            source === target ||
            !this.isLegalLocationForCard(card, target) ||
            !card ||
            card.location !== source
        ) {
            return;
        }

        if(
            card.isProvince &&
            target !== Location.ProvinceDeck &&
            this.getSourceList(target).some((other) => other.isProvince)
        ) {
            return;
        }

        const revealingPiles: string[] = [
            Location.PlayArea,
            Location.DynastyDiscardPile,
            Location.ConflictDiscardPile,
            Location.RemovedFromGame
        ];
        let display: string | BaseCard = 'a card';
        if((card.isFaceup() && source !== Location.Hand) || revealingPiles.includes(target)) {
            display = card;
        }

        this.game.addMessage(msg`${this} manually moves ${display} from their ${source} to their ${target}`);
        if(card.isDrawCard()) {
            card.removedByEphemeral = false;
        }
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    isLegalLocationForCard(card: BaseCard | undefined, location: Location): boolean {
        if(!card) {
            return false;
        }

        if(location === Location.Underneath) {
            return true;
        }

        const conflictCardLocations = [
            ...this.game.getProvinceArray(),
            Location.Hand,
            Location.ConflictDeck,
            Location.ConflictDiscardPile,
            Location.RemovedFromGame
        ];
        const dynastyCardLocations = [
            ...this.game.getProvinceArray(),
            Location.DynastyDeck,
            Location.DynastyDiscardPile,
            Location.RemovedFromGame,
            Location.UnderneathStronghold
        ];
        // A character's printed type is always 'character'; dynasty and conflict
        // characters live in different zones, so split that one type into two
        // derived categories. These are not CardType — they are lookup keys.
        type LocationCategory = CardType | 'dynastyCharacter' | 'conflictCharacter';
        const legalLocations: Partial<Record<LocationCategory, Location[]>> = {
            [CardType.Stronghold]: [Location.StrongholdProvince],
            [CardType.Role]: [Location.Role],
            [CardType.Province]: [...this.game.getProvinceArray(), Location.ProvinceDeck],
            [CardType.Holding]: dynastyCardLocations,
            conflictCharacter: [...conflictCardLocations, Location.PlayArea],
            dynastyCharacter: [...dynastyCardLocations, Location.PlayArea],
            [CardType.Event]: [...new Set([...conflictCardLocations, ...dynastyCardLocations, Location.BeingPlayed])],
            [CardType.Attachment]: [...conflictCardLocations, Location.PlayArea]
        };

        let category: LocationCategory = card.type;
        if(location === Location.DynastyDiscardPile || location === Location.ConflictDiscardPile) {
            category = isEnumValue(CardType, card.printedType) ? card.printedType : card.type;
        }

        if(category === CardType.Character) {
            category = card.isDynasty ? 'dynastyCharacter' : 'conflictCharacter';
        }

        return !!legalLocations[category]?.some((legal) => legal === location);
    }

    /** Puts the card in this player's pile underneath `host`. */
    placeUnderneath(card: BaseCard, host: BaseCard): void {
        this.moveCard(card, Location.Underneath, { host });
    }

    promptForAttachment(card: DrawCard): void {
        this.game.queueSimpleStep(() =>
            this.game.promptForSelect(this, {
                source: 'Play Attachment',
                activePromptTitle: 'Select target for attachment',
                controller: Players.Self,
                gameAction: attach({ attachment: card }),
                onSelect: (_player: Player, target) => {
                    attach({ attachment: card }).resolve(target, new AbilityContext({ game: this.game, player: this, source: target }));
                    return true;
                }
            })
        );
    }

    isAttackingPlayer(): boolean {
        return !!this.game.currentConflict && this.game.currentConflict.attackingPlayer === this;
    }

    isDefendingPlayer(): boolean {
        return !!this.game.currentConflict && this.game.currentConflict.defendingPlayer === this;
    }

    resetForConflict(): void {
        this.cardsInPlay.forEach((card: DrawCard) => {
            card.resetForConflict();
        });
    }

    get honorBid(): number {
        return Math.max(0, this.showBid + this.honorBidModifier);
    }

    get gloryModifier(): number {
        return this.sumEffects(EffectName.ChangePlayerGloryModifier);
    }

    get skillModifier(): number {
        return this.sumEffects(EffectName.ChangePlayerSkillModifier);
    }

    /** Skill added "during this conflict's resolution" (Disguised Protector). */
    get resolutionSkillModifier(): number {
        return this.sumEffects(EffectName.ChangePlayerResolutionSkillModifier);
    }

    honorGained(round: number | null = null, phase: Phase | '' | null = null, onlyPositive: boolean = false): number {
        return this.honorTracker.honorGained(round, phase, onlyPositive);
    }

    modifyFate(amount: number): void {
        const before = this.fate;
        this.fate = Math.max(0, this.fate + amount);
        const actual = this.fate - before;
        if(actual !== 0 && this.game) {
            this.game.addAnimation({ type: 'fate', playerName: this.name, amount: actual });
        }
    }

    modifyHonor(amount: number): void {
        this.honorTracker.modifyHonor(amount, this.game.currentPhase, this.game.roundNumber);
    }

    resetHonorEvents(round: number, phase: Phase): void {
        this.honorTracker.resetHonorEvents(round, phase);
    }

    isMoreHonorable(): boolean {
        if(this.anyEffect(EffectName.ConsideredLessHonorable)) {
            return false;
        }
        if(this.opponent && this.opponent.anyEffect(EffectName.ConsideredLessHonorable)) {
            return true;
        }
        return this.opponent !== undefined && this.honor > this.opponent.honor;
    }

    isLessHonorable(): boolean {
        if(this.anyEffect(EffectName.ConsideredLessHonorable)) {
            return true;
        }
        if(this.opponent && this.opponent.anyEffect(EffectName.ConsideredLessHonorable)) {
            return false;
        }
        return this.opponent !== undefined && this.honor < this.opponent.honor;
    }

    hasAffinity(trait: Trait, context?: AbilityContext): boolean {
        if(!this.checkRestrictions(RestrictionType.HaveAffinity, context ?? this.game.getFrameworkContext(this))) {
            return false;
        }

        for(const cheatedAffinities of this.getEffects(EffectName.SatisfyAffinity)) {
            if(cheatedAffinities.includes(trait)) {
                return true;
            }
        }

        return this.cardsInPlay.some((card: DrawCard) => card.type === CardType.Character && card.hasTrait(trait));
    }

    getClaimedRings(): Ring[] {
        return Object.values(this.game.rings).filter((ring: Ring) => ring.isConsideredClaimed(this));
    }

    getGloryCount(): number {
        return this.cardsInPlay.reduce(
            (total: number, card: DrawCard) => total + card.getContributionToImperialFavor(),
            this.getClaimedRings().length + this.gloryModifier
        );
    }

    claimImperialFavor(favorType?: FavorType): void {
        if(this.opponent) {
            this.opponent.loseImperialFavor();
        }
        const sovereign = this.game.rules.imperialFavorSovereign;
        if(!this.game.rules.imperialFavorHasSides) {
            this.imperialFavor = FavorType.Both;
            this.game.addMessage(msg`${this} claims the ${sovereign} favor!`);
            return;
        }
        if(favorType && favorType !== FavorType.Both) {
            this.imperialFavor = favorType;
            this.game.addMessage(msg`${this} claims the ${sovereign} ${favorType} favor!`);
            return;
        }

        const claim = (type: FavorType) => () => {
            this.imperialFavor = type;
            this.game.addMessage(msg`${this} claims the ${sovereign} ${type} favor!`);
        };
        this.game.promptWithHandlerMenu(this, {
            activePromptTitle: 'Which side of the Imperial Favor would you like to claim?',
            source: 'Imperial Favor',
            options: [
                { text: 'Military', handler: claim(FavorType.Military) },
                { text: 'Political', handler: claim(FavorType.Political) }
            ]
        });
    }

    loseImperialFavor(): void {
        this.imperialFavor = '';
    }

    selectDeck(deck: DeckDTO): void {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;
        const strongholdData = deck.stronghold?.[0]?.card;
        if(strongholdData && this.game.rules.setupHaveStrongholds) {
            this.stronghold = new StrongholdCard(this, strongholdData);
        }
        this.faction = deck.faction ?? {};
    }

    moveCard(card: BaseCard, targetLocation: Location, options: MoveCardOptions = {}): void {
        if(!this.isLegalLocationForCard(card, targetLocation) || (targetLocation === Location.Underneath && !options.host) ||
            (card.isDrawCard() && card.isRemovedByEphemeral())) {
            return;
        }
        this.removeCardFromPile(card);

        const targetPile = targetLocation === Location.Underneath && options.host
            ? this.zones.underneathPile(options.host).cards
            : this.getSourceList(targetLocation);
        if(targetPile.includes(card)) {
            return;
        }

        const location = card.location;
        const toProvince = this.game.getProvinceArray().some((province) => province === targetLocation);

        if(
            location === Location.PlayArea ||
            (card.type === CardType.Holding &&
                card.isInProvince() &&
                !toProvince)
        ) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for(const attachment of card.attachments) {
                attachment.leavesPlay(targetLocation);
                attachment.owner.moveCard(
                    attachment,
                    attachment.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
                );
            }

            card.leavesPlay(targetLocation);
            card.controller = this;
        } else if(targetLocation === Location.PlayArea && card.isDrawCard()) {
            card.setDefaultController(this);
            card.controller = this;
            if(card.type === CardType.Attachment) {
                this.promptForAttachment(card);
                return;
            }
        } else if(location === Location.BeingPlayed && card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if(card.type === CardType.Holding && toProvince) {
            card.controller = this;
        } else if(targetLocation === Location.BeingPlayed) {
            card.controller = this;
        } else {
            card.controller = card.owner;
        }

        if(toProvince) {
            if([Location.DynastyDeck].includes(location)) {
                card.facedown = true;
            }
            if(!this.takenDynastyMulligan && card.isDynasty) {
                card.facedown = false;
            }
            targetPile.push(card);
        } else if((targetLocation === Location.ConflictDeck || targetLocation === Location.DynastyDeck) && !options.bottom) {
            targetPile.unshift(card);
        } else if(
            targetLocation === Location.ConflictDiscardPile ||
            targetLocation === Location.DynastyDiscardPile ||
            targetLocation === Location.RemovedFromGame
        ) {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        card.host = targetLocation === Location.Underneath ? options.host ?? null : null;
        card.moveTo(targetLocation);
    }

    removeCardFromPile(card: BaseCard): void {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        this.zones.removeCard(card.isUnderneath() && card.host ? card.host.uuid : card.location, card.uuid);
    }

    getTotalIncome(): number {
        return this.game.rules.fatePerRoundForced ?? this.stronghold?.cardData.fate ?? 0;
    }

    getTotalHonor(): number {
        return this.honorTracker.getTotalHonor();
    }

    getFate(): number {
        return this.fate;
    }

    /** The fate the player could spend from their pool: none while they cannot spend fate (Blood of Onnotangu). */
    getSpendableFate(context: AbilityContext): number {
        return this.checkRestrictions(RestrictionType.SpendFate, context) ? this.fate : 0;
    }

    /** Whether the player can spend `amount` fate from their pool. Spending nothing is always possible. */
    canSpendFate(amount: number, context: AbilityContext): boolean {
        return amount <= 0 || this.getSpendableFate(context) >= amount;
    }

    setSelectedCards(cards: BaseCard[]): void {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards(): void {
        this.promptState.clearSelectedCards();
    }

    setSelectableCards(cards: BaseCard[]): void {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards(): void {
        this.promptState.clearSelectableCards();
    }

    setSelectableRings(rings: Ring[]): void {
        this.promptState.setSelectableRings(rings);
    }

    clearSelectableRings(): void {
        this.promptState.clearSelectableRings();
    }

    getSummaryForHand(list: BaseCard[], activePlayer: StateViewer, hideWhenFaceup: boolean): CardSummary[] {
        return this.stateBuilder.getSummaryForHand(list, activePlayer, hideWhenFaceup);
    }

    getSummaryForCardList(list: BaseCard[], activePlayer: StateViewer, hideWhenFaceup?: boolean): CardSummary[] {
        return this.stateBuilder.getSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getSortedSummaryForCardList(list: BaseCard[], activePlayer: StateViewer, hideWhenFaceup?: boolean): CardSummary[] {
        return this.stateBuilder.getSortedSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getCardSelectionState(card: BaseCard) {
        return this.promptState.getCardSelectionState(card);
    }

    getRingSelectionState(ring: Ring) {
        return this.promptState.getRingSelectionState(ring);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt: Parameters<PlayerPromptState['setPrompt']>[0]): void {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt(): void {
        this.promptState.cancelPrompt();
    }

    passDynasty(): void {
        this.passedDynasty = true;
    }

    setShowBid(bid: number): void {
        this.showBid = bid;
        this.game.addMessage(msg`${this} reveals a bid of ${bid}`);
    }

    isTopConflictCardShown(activePlayer?: StateViewer): boolean {
        if(this.conflictDeck.length <= 0) {
            return false;
        }

        const resolvedPlayer = activePlayer ?? this;

        if(resolvedPlayer === this) {
            return (
                this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Any) ||
                this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Self)
            );
        }

        return (
            this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Any) ||
            this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Opponent)
        );
    }

    eventsCannotBeCancelled(): boolean {
        return this.anyEffect(EffectName.EventsCannotBeCancelled);
    }

    isTopDynastyCardShown(_activePlayer?: StateViewer): boolean {
        if(this.dynastyDeck.length <= 0) {
            return false;
        }
        return this.anyEffect(EffectName.ShowTopDynastyCard);
    }

    /** Resolves the effect of the ring of `element` again (the Fire ring's Back option). */
    resolveRingEffect(element: Element, optional: boolean = true, onResolution?: (resolved: boolean) => void): void {
        this.game.resolveAbility(RingAbilities.contextFor(this, element, optional, onResolution));
    }

    isKihoPlayedThisConflict(context: AbilityContext, cardBeingPlayed: BaseCard): boolean {
        if(!context.game.currentConflict) {
            return false;
        }
        return (
            context.game.currentConflict.getNumberOfCardsPlayed(
                this,
                (card) => card.hasTrait(Trait.Kiho) && card.uuid !== cardBeingPlayed.uuid
            ) > 0
        );
    }

    hasDeclaredConflictOfType(context: AbilityContext, conflictType: ConflictType): boolean {
        const conflicts = context.game.getConflicts(this);
        const declaredConflicts = conflicts.filter((conflict) => conflict.declaredType === conflictType);

        return declaredConflicts.length > 0;
    }

    getStats() {
        return this.stateBuilder.getStats();
    }

    getState(activePlayer: StateViewer): PlayerState {
        return this.stateBuilder.getState(activePlayer);
    }

    override getShortSummary() {
        return this.stateBuilder.getShortSummary();
    }
}

export default Player;
