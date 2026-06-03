import { shuffle } from './utils/shuffle.js';
import { HonorTracker } from './HonorTracker.js';
import { PlayerZones } from './PlayerZones.js';

import { GameObject } from './GameObject.js';
import { Deck } from './Deck.js';
import AttachmentPrompt from './gamesteps/AttachmentPrompt.js';
import { clockFor } from './Clocks/ClockSelector.js';
import { CostReducer } from './CostReducer.js';
import * as GameActions from './GameActions/GameActions.js';
import { RingEffects } from './RingEffects.js';
import { PlayableLocation } from './PlayableLocation.js';
import { PlayerPromptState } from './PlayerPromptState.js';
import { RoleCard } from './RoleCard.js';
import { StrongholdCard } from './StrongholdCard.js';

import {
    AbilityType,
    CardType,
    ConflictType,
    Decks,
    EffectName,
    EventName,
    FavorType,
    Location,
    Players,
    PlayType
} from './Constants.js';
import { GameModes } from '../GameModes.js';
import type Game from './Game.js';
import type Socket from '../Socket.js';
import type BaseCard from './BaseCard.js';
import type { CardSummary } from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Ring from './Ring.js';
import type { ClockInterface } from './Clocks/types.js';
import type { AbilityContext } from './AbilityContext.js';

export interface PlayerState {
    cardPiles: { [pile: string]: CardSummary[] };
    provinces: { one: CardSummary[]; two: CardSummary[]; three: CardSummary[]; four: CardSummary[] };
    [key: string]: unknown;
}

class Player extends GameObject {
    user: any;
    emailHash: string;
    declare id: string;
    owner: boolean;
    declare printedType: string;
    socket: Socket | null | undefined;
    disconnected: boolean;
    left: boolean;
    lobbyId: string | null;

    readonly zones: PlayerZones = new PlayerZones();

    faction: any;
    stronghold: StrongholdCard | null;
    role: RoleCard | null;

    hideProvinceDeck: boolean;
    takenDynastyMulligan: boolean;
    takenConflictMulligan: boolean;
    passedDynasty: boolean;
    actionPhasePriority: boolean;
    honorBidModifier: number;
    showBid: number;
    declaredConflictOpportunities: Record<string, number>;
    defaultAllowedConflicts: Record<string, number>;
    imperialFavor: string;

    clock: ClockInterface;

    limitedPlayed: number;
    deck: any;
    costReducers: CostReducer[];
    playableLocations: PlayableLocation[];
    abilityMaxByIdentifier: Record<string, any>;
    promptedActionWindows: Record<string, boolean>;
    timerSettings: Record<string, any>;
    optionSettings: Record<string, any>;
    resetTimerAtEndOfRound: boolean;
    private honorTracker: HonorTracker = new HonorTracker();

    promptState: PlayerPromptState;
    opponent?: Player;
    preparedDeck: any;
    outsideTheGameCards: any;
    fate: number = 0;
    readyToStart: boolean = false;
    maxLimited: number = 1;
    firstPlayer: boolean = false;
    showConflict: boolean = false;
    showDynasty: boolean = false;
    noTimer: boolean = false;

    constructor(id: string, user: any, owner: boolean, game: Game, clockdetails?: any) {
        super(game, user.username);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;
        this.printedType = 'player';
        this.socket = null;
        this.disconnected = false;
        this.left = false;
        this.lobbyId = null;

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
        this.declaredConflictOpportunities = {
            military: 0,
            political: 0,
            passed: 0,
            forced: 0
        };
        this.defaultAllowedConflicts = {
            military: 1,
            political: 1
        };
        this.imperialFavor = '';

        this.clock = clockFor(this, clockdetails);

        this.limitedPlayed = 0;
        this.deck = {};
        this.costReducers = [];
        this.playableLocations = [
            new PlayableLocation(PlayType.PlayFromHand, this, Location.Hand),
            new PlayableLocation(PlayType.PlayFromProvince, this, Location.ProvinceOne),
            new PlayableLocation(PlayType.PlayFromProvince, this, Location.ProvinceTwo),
            new PlayableLocation(PlayType.PlayFromProvince, this, Location.ProvinceThree)
        ];
        if(this.game.gameMode !== GameModes.Skirmish) {
            this.playableLocations.push(
                new PlayableLocation(PlayType.PlayFromProvince, this, Location.ProvinceFour)
            );
            this.playableLocations.push(
                new PlayableLocation(PlayType.PlayFromProvince, this, Location.StrongholdProvince)
            );
        }
        this.abilityMaxByIdentifier = {};
        this.promptedActionWindows = user.promptedActionWindows || {
            dynasty: true,
            draw: true,
            preConflict: true,
            conflict: true,
            fate: true,
            regroup: true
        };
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.optionSettings = user.settings.optionSettings;
        this.resetTimerAtEndOfRound = false;
        this.promptState = new PlayerPromptState(this);
    }

    get honor(): number {
        return this.honorTracker.honor;
    }

    set honor(value: number) {
        this.honorTracker.honor = value;
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

    get provinceDeck(): BaseCard[] {
        return this.zones.provinceDeck;
    }
    set provinceDeck(v: BaseCard[]) {
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

    get additionalPiles(): Record<string, any> {
        return this.zones.additionalPiles;
    }
    set additionalPiles(v: Record<string, any>) {
        this.zones.additionalPiles = v;
    }

    get underneathStronghold(): BaseCard[] {
        return this.zones.underneathStronghold;
    }
    set underneathStronghold(v: BaseCard[]) {
        this.zones.underneathStronghold = v;
    }

    getSourceList(source: string): BaseCard[] {
        return this.zones.getSourceList(source);
    }

    updateSourceList(source: string, targetList: BaseCard[]): void {
        this.zones.updateSourceList(source, targetList);
    }

    createAdditionalPile(name: string, properties?: any): void {
        this.zones.createAdditionalPile(name, properties);
    }

    getDynastyCardInProvince(location: string): DrawCard | undefined {
        return this.zones.getDynastyCardInProvince(location);
    }

    getDynastyCardsInProvince(location: string): DrawCard[] {
        return this.zones.getDynastyCardsInProvince(location);
    }

    getProvinceCardInProvince(location: string): ProvinceCard | undefined {
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

    isCardUuidInList(list: BaseCard[], card: BaseCard): boolean {
        return list.some((c) => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list: BaseCard[], card: BaseCard): boolean {
        return list.some((c) => {
            return c.name === card.name;
        });
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

    findCardInPlayByUuid(uuid: string): DrawCard | null {
        return this.findCard(this.cardsInPlay, (card) => card.uuid === uuid) as DrawCard | null;
    }

    findCard(cardList: BaseCard[], predicate: (card: BaseCard) => boolean): BaseCard | undefined {
        const cards = this.findCards(cardList, predicate);
        if(!cards || cards.length === 0) {
            return undefined;
        }

        return cards[0];
    }

    findCards(cardList: BaseCard[], predicate: (card: BaseCard) => boolean): BaseCard[] {
        if(!cardList) {
            return [];
        }

        const cardsToReturn: BaseCard[] = [];

        for(const card of cardList) {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            const attachments = (card as DrawCard).attachments;
            if(attachments) {
                cardsToReturn.push(...attachments.filter(predicate));
            }
        }

        return cardsToReturn;
    }

    isTraitInPlay(trait: string): boolean {
        return this.game.allCards.some((card: any) => {
            return (
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Location.PlayArea ||
                    (card.isProvince && !card.isBroken) ||
                    (card.isInProvince() && card.type === CardType.Holding))
            );
        });
    }

    isCharacterTraitInPlay(trait: string): boolean {
        return this.game.allCards.some((card: any) => {
            return (
                card.type === CardType.Character &&
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Location.PlayArea ||
                    (card.isProvince && !card.isBroken) ||
                    (card.isInProvince() && card.type === CardType.Holding))
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
        const gameModeProvinceCount = this.game.gameMode === GameModes.Skirmish ? 3 : 5;
        const locations = [
            Location.ProvinceOne,
            Location.ProvinceTwo,
            Location.ProvinceThree,
            Location.ProvinceFour,
            Location.StrongholdProvince
        ].slice(0, gameModeProvinceCount);
        return locations.map((location) => this.getProvinceCardInProvince(location) as ProvinceCard);
    }

    anyCardsInPlay(predicate: (card: DrawCard) => boolean): boolean {
        return this.game.allCards.some(
            (card) => card.controller === this && card.location === Location.PlayArea && predicate(card as DrawCard)
        );
    }

    getAllConflictCards(predicate: (card: DrawCard) => boolean = () => true): DrawCard[] {
        return this.game.allCards.filter(
            (card) => card.owner === this && card.isConflict && predicate(card as DrawCard)
        ) as DrawCard[];
    }

    filterCardsInPlay(predicate: (card: DrawCard) => boolean): DrawCard[] {
        return this.game.allCards.filter(
            (card) => card.controller === this && card.location === Location.PlayArea && predicate(card as DrawCard)
        ) as DrawCard[];
    }

    hasComposure(): boolean {
        return this.opponent !== undefined && this.opponent.showBid > this.showBid;
    }

    hasLegalConflictDeclaration(properties: any): boolean {
        const conflictType = this.getLegalConflictTypes(properties);
        if(conflictType.length === 0) {
            return false;
        }
        let conflictRing = properties.ring || Object.values(this.game.rings);
        conflictRing = Array.isArray(conflictRing) ? conflictRing : [conflictRing];
        conflictRing = conflictRing.filter((ring: Ring) => ring.canDeclare(this));
        if(conflictRing.length === 0) {
            return false;
        }
        const cards = properties.attacker ? [properties.attacker] : this.cardsInPlay.slice();
        if(!this.opponent) {
            return conflictType.some((type: string) =>
                conflictRing.some((ring: Ring) => cards.some((card: DrawCard) => card.canDeclareAsAttacker(type, ring)))
            );
        }
        let conflictProvince = properties.province || (this.opponent && this.opponent.getProvinces());
        conflictProvince = Array.isArray(conflictProvince) ? conflictProvince : [conflictProvince];
        return conflictType.some((type: string) =>
            conflictRing.some((ring: Ring) =>
                conflictProvince.some(
                    (province: any) =>
                        province.canDeclare(type, ring) &&
                        cards.some((card: DrawCard) => card.canDeclareAsAttacker(type, ring, province))
                )
            )
        );
    }

    getConflictOpportunities(): number {
        const setConflictDeclarationType = this.mostRecentEffect(EffectName.SetConflictDeclarationType);
        const forceConflictDeclarationType = this.mostRecentEffect(EffectName.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.mostRecentEffect(EffectName.ProvideConflictDeclarationType);
        const maxConflicts = this.mostRecentEffect(EffectName.SetMaxConflicts);
        const skirmishModeRRGLimit = this.game.gameMode === GameModes.Skirmish ? 1 : 0;
        if(maxConflicts) {
            return this.getConflictsWhenMaxIsSet(maxConflicts);
        }

        if(provideConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(provideConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        if(forceConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(forceConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        if(setConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(setConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        return (
            this.getRemainingConflictOpportunitiesForType(ConflictType.Military) +
            this.getRemainingConflictOpportunitiesForType(ConflictType.Political) -
            this.declaredConflictOpportunities[ConflictType.Passed] -
            this.declaredConflictOpportunities[ConflictType.Forced] -
            skirmishModeRRGLimit
        );
    }

    getRemainingConflictOpportunitiesForType(type: string): number {
        return Math.max(0, this.getMaxConflictOpportunitiesForPlayerByType(type) - this.declaredConflictOpportunities[type]);
    }

    getLegalConflictTypes(properties: any): string[] {
        let types = properties.type || [ConflictType.Military, ConflictType.Political];
        types = Array.isArray(types) ? types : [types];
        const forcedDeclaredType =
            properties.forcedDeclaredType ||
            (this.game.currentConflict && this.game.currentConflict.forcedDeclaredType);
        if(forcedDeclaredType) {
            return [forcedDeclaredType].filter(
                (type: string) =>
                    types.includes(type) &&
                    this.getConflictOpportunities() > 0 &&
                    !this.getEffects(EffectName.CannotDeclareConflictsOfType).includes(type)
            );
        }

        if(this.getConflictOpportunities() === 0) {
            return [];
        }

        return types.filter(
            (type: string) =>
                this.getRemainingConflictOpportunitiesForType(type) > 0 &&
                !this.getEffects(EffectName.CannotDeclareConflictsOfType).includes(type)
        );
    }

    getConflictsWhenMaxIsSet(maxConflicts: number): number {
        return Math.max(0, maxConflicts - this.game.getConflicts(this).length);
    }

    getMaxConflictOpportunitiesForPlayerByType(type: string): number {
        let setConflictType = this.mostRecentEffect(EffectName.SetConflictDeclarationType);
        let forceConflictType = this.mostRecentEffect(EffectName.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.mostRecentEffect(EffectName.ProvideConflictDeclarationType);
        const additionalConflictEffects = this.getEffects(EffectName.AdditionalConflict);
        const additionalConflictsForType = additionalConflictEffects.filter((x: string) => x === type).length;
        let baselineAvailableConflicts =
            this.defaultAllowedConflicts[ConflictType.Military] +
            this.defaultAllowedConflicts[ConflictType.Political];
        if(provideConflictDeclarationType && setConflictType !== provideConflictDeclarationType) {
            setConflictType = undefined;
        }
        if(provideConflictDeclarationType && forceConflictType !== provideConflictDeclarationType) {
            forceConflictType = undefined;
        }

        if(this.game.gameMode === GameModes.Skirmish) {
            baselineAvailableConflicts = 1;
        }

        if(setConflictType && type === setConflictType) {
            let declaredConflictsOfOtherType = 0;
            if(setConflictType === ConflictType.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Military];
            }
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(setConflictType && type !== setConflictType) {
            return 0;
        }
        if(forceConflictType && type === forceConflictType) {
            let declaredConflictsOfOtherType = 0;
            if(forceConflictType === ConflictType.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Military];
            }
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(forceConflictType && type !== forceConflictType) {
            return 0;
        }
        if(provideConflictDeclarationType) {
            let declaredConflictsOfOtherType = 0;
            if(type === ConflictType.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Military];
            }
            const availableAll =
                baselineAvailableConflicts +
                this.getEffects(EffectName.AdditionalConflict).length -
                declaredConflictsOfOtherType;
            if(type === provideConflictDeclarationType) {
                return availableAll;
            }
            const maxType = this.defaultAllowedConflicts[type] + additionalConflictsForType;
            const declaredType = this.declaredConflictOpportunities[type];
            return Math.min(maxType - declaredType, availableAll);
        }
        return this.defaultAllowedConflicts[type] + additionalConflictsForType;
    }

    getProvinces(predicate: (card: ProvinceCard) => boolean = () => true): ProvinceCard[] {
        return this.game
            .getProvinceArray()
            .reduce(
                (array: ProvinceCard[], location: Location) =>
                    array.concat(
                        this.getSourceList(location).filter(
                            (card) => card.type === CardType.Province && predicate(card as ProvinceCard)
                        ) as ProvinceCard[]
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
            if(card.controller === this && card.location === Location.PlayArea && predicate(card as DrawCard)) {
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
        if(card.getEffects(EffectName.CanPlayFromOutOfPlay).filter((a: any) => a.player(this, card)).length > 0) {
            return true;
        }

        return this.playableLocations.some(
            (location) => (!playingType || location.playingType === playingType) && location.contains(card as DrawCard)
        );
    }

    findPlayType(card: BaseCard): PlayType | undefined {
        if(card.getEffects(EffectName.CanPlayFromOutOfPlay).filter((a: any) => a.player(this, card)).length > 0) {
            const effects = card.getEffects(EffectName.CanPlayFromOutOfPlay).filter((a: any) => a.player(this, card));
            return effects[effects.length - 1].playType || PlayType.PlayFromHand;
        }

        const location = this.playableLocations.find((location) => location.contains(card as DrawCard));
        if(location) {
            return location.playingType;
        }

        return undefined;
    }

    getDuplicateInPlay(card: DrawCard): DrawCard | undefined {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, (playCard) => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        }) as DrawCard | undefined;
    }

    drawCardsToHand(numCards: number): void {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.length) {
            remainingCards = numCards - this.conflictDeck.length;
            const cards = this.conflictDeck.slice();
            this.deckRanOutOfCards('conflict');
            this.game.queueSimpleStep(() => {
                for(const card of cards) {
                    this.moveCard(card, Location.Hand);
                }
            });
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        } else {
            for(const card of this.conflictDeck.slice(0, numCards)) {
                this.moveCard(card, Location.Hand);
            }
        }
    }

    deckRanOutOfCards(deck: string): void {
        const discardPile = this.getSourceList(deck + ' discard pile');
        const action = GameActions.loseHonor({ amount: this.game.gameMode === GameModes.Skirmish ? 3 : 5 });
        if(action.canAffect(this, this.game.getFrameworkContext())) {
            this.game.addMessage(
                '{0}\'s {1} deck has run out of cards, so they lose {2} honor',
                this,
                deck,
                this.game.gameMode === GameModes.Skirmish ? 3 : 5
            );
        } else {
            this.game.addMessage('{0}\'s {1} deck has run out of cards', this, deck);
        }
        action.resolve(this, this.game.getFrameworkContext());
        this.game.queueSimpleStep(() => {
            discardPile.forEach((card: BaseCard) => this.moveCard(card, deck + ' deck'));
            if(deck === 'dynasty') {
                this.shuffleDynastyDeck();
            } else {
                this.shuffleConflictDeck();
            }
        });
    }

    replaceDynastyCard(location: string): boolean {
        const province = this.getProvinceCardInProvince(location);

        if(!province || this.getSourceList(location).length > 1) {
            return false;
        }
        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.replaceDynastyCard(location));
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

    putTopDynastyCardInProvince(location: string, facedown: boolean = false): boolean {
        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.putTopDynastyCardInProvince(location, facedown));
        } else {
            const cardFromDeck = this.dynastyDeck[0];
            this.moveCard(cardFromDeck, location);
            cardFromDeck.facedown = facedown;
            return true;
        }
        return true;
    }

    refillProvince(location: string, refillAmount: number): boolean {
        if(refillAmount <= 0) {
            return true;
        }

        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount));
            return true;
        }
        const province = this.getProvinceCardInProvince(location);
        const refillFunc = province?.mostRecentEffect(EffectName.CustomProvinceRefillEffect);
        if(refillFunc) {
            refillFunc(this, province);
        } else {
            this.moveCard(this.dynastyDeck[0], location);
        }

        this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount - 1));
        return true;
    }

    shuffleConflictDeck(): void {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.emitEvent(EventName.OnDeckShuffled, { player: this, deck: Decks.ConflictDeck });
        this.conflictDeck = shuffle(this.conflictDeck);
    }

    shuffleDynastyDeck(): void {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.emitEvent(EventName.OnDeckShuffled, { player: this, deck: Decks.DynastyDeck });
        this.dynastyDeck = shuffle(this.dynastyDeck);
    }

    prepareDecks(): void {
        const deck = new Deck(this.deck);
        const preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction;
        this.provinceDeck = preparedDeck.provinceCards;
        if(preparedDeck.stronghold instanceof StrongholdCard) {
            this.stronghold = preparedDeck.stronghold;
        }
        if(preparedDeck.role instanceof RoleCard) {
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

    addCostReducer(source: any, properties: any): CostReducer {
        const reducer = new CostReducer(this.game, source, properties);
        this.costReducers.push(reducer);
        return reducer;
    }

    removeCostReducer(reducer: CostReducer): void {
        if(this.costReducers.includes(reducer)) {
            reducer.unregisterEvents();
            this.costReducers = this.costReducers.filter((r) => r !== reducer);
        }
    }

    addPlayableLocation(type: PlayType, player: Player, location: Location, cards: BaseCard[] = []): PlayableLocation | undefined {
        if(!player) {
            return undefined;
        }
        const playableLocation = new PlayableLocation(type as PlayType, player, location, new Set(cards as DrawCard[]));
        this.playableLocations.push(playableLocation);
        return playableLocation;
    }

    removePlayableLocation(location: PlayableLocation): void {
        this.playableLocations = this.playableLocations.filter((l) => l !== location);
    }

    getAlternateFatePools(playingType: PlayType | undefined, card: DrawCard, context?: AbilityContext): any[] {
        const effects = this.getEffects(EffectName.AlternateFatePool);
        let alternateFatePools = effects
            .filter((match: any) => match(card) && match(card).getFate() > 0)
            .map((match: any) => match(card));

        if(context && context.source && context.source.isTemptationsMaho()) {
            alternateFatePools.push(...this.cardsInPlay.filter((a: any) => a.type === 'character'));
        }
        if(context && context.source && context.source.isTemptationsMaho()) {
            alternateFatePools = alternateFatePools.filter(
                (a: any) => a.printedType !== 'ring' && a.type === CardType.Character
            );
        }

        const rings = alternateFatePools.filter((a: any) => a.printedType === 'ring');
        const cards = alternateFatePools.filter((a: any) => a.printedType !== 'ring');
        if(
            !this.checkRestrictions('takeFateFromRings', context) ||
            (context && context.source && context.source.isTemptationsMaho())
        ) {
            rings.forEach((ring: any) => {
                alternateFatePools = alternateFatePools.filter((a: any) => a !== ring);
            });
        }

        cards.forEach((card: any) => {
            if(!card.allowGameAction('removeFate') && card.type !== CardType.Attachment) {
                alternateFatePools = alternateFatePools.filter((a: any) => a !== card);
            }
        });

        return [...new Set(alternateFatePools)];
    }

    getMinimumCost(playingType: PlayType | undefined, context: AbilityContext, target?: any, ignoreType: boolean = false): number {
        const card = context.source;
        const reducedCost = this.getReducedCost(playingType, card as DrawCard, target, ignoreType);
        const alternateFatePools = this.getAlternateFatePools(playingType, card as DrawCard, context);
        const alternateFate = alternateFatePools.reduce((total: number, pool: any) => total + pool.fate, 0);
        let triggeredCostReducers = 0;
        const fakeWindow = { addChoice: () => triggeredCostReducers++ };
        const fakeEvent = this.game.getEvent(EventName.OnCardPlayed, { card: card, player: this, context: context });
        this.game.emit(EventName.OnCardPlayed + ':' + AbilityType.Interrupt, fakeEvent, fakeWindow);
        const fakeResolverEvent = this.game.getEvent(EventName.OnAbilityResolverInitiated, {
            card: card,
            player: this,
            context: context
        });
        this.game.emit(
            EventName.OnAbilityResolverInitiated + ':' + AbilityType.Interrupt,
            fakeResolverEvent,
            fakeWindow
        );
        return Math.max(reducedCost - triggeredCostReducers - alternateFate, 0);
    }

    getReducedCost(playingType: PlayType | undefined, card: DrawCard, target?: any, ignoreType: boolean = false): number {
        const matchingReducers = this.costReducers.filter((reducer) =>
            reducer.canReduce(playingType as PlayType, card, target, ignoreType)
        );
        const costIncreases = matchingReducers
            .filter((a) => a.getAmount(card, this) < 0)
            .reduce((cost, reducer) => cost - reducer.getAmount(card, this), 0);
        const costDecreases = matchingReducers
            .filter((a) => a.getAmount(card, this) > 0)
            .reduce((cost, reducer) => cost + reducer.getAmount(card, this), 0);

        const baseCost = (card.getCost() || 0) + costIncreases;
        const reducedCost = baseCost - costDecreases;

        const costFloor = Math.min(baseCost, Math.max(...matchingReducers.map((a) => a.getCostFloor())));
        return Math.max(reducedCost, costFloor);
    }

    getTotalCostModifiers(playingType: PlayType | undefined, card: DrawCard, target?: any, ignoreType: boolean = false): number {
        const baseCost = 0;
        const matchingReducers = this.costReducers.filter((reducer) =>
            reducer.canReduce(playingType as PlayType, card, target, ignoreType)
        );
        const reducedCost = matchingReducers.reduce((cost, reducer) => cost - reducer.getAmount(card, this), baseCost);
        return reducedCost;
    }

    getAvailableAlternateFate(playingType: PlayType | undefined, context: AbilityContext): number {
        const card = context.source as DrawCard;
        const alternateFatePools = this.getAlternateFatePools(playingType, card);
        const alternateFate = alternateFatePools.reduce((total: number, pool: any) => total + pool.fate, 0);
        return Math.max(alternateFate, 0);
    }

    getTargetingCost(abilitySource: any, targets: any): number {
        targets = Array.isArray(targets) ? targets : [targets];
        targets = targets.filter(Boolean);
        if(targets.length === 0) {
            return 0;
        }

        const playerCostToTargetEffects = abilitySource.controller
            ? abilitySource.controller.getEffects(EffectName.PlayerFateCostToTargetCard)
            : [];

        let targetCost = 0;
        for(const target of targets) {
            for(const cardCostToTarget of target.getEffects(EffectName.FateCostToTarget)) {
                if(
                    (!cardCostToTarget.cardType || abilitySource.type === cardCostToTarget.cardType) &&
                    (!cardCostToTarget.targetPlayer ||
                        abilitySource.controller ===
                            (cardCostToTarget.targetPlayer === Players.Self
                                ? target.controller
                                : target.controller.opponent))
                ) {
                    targetCost += cardCostToTarget.amount;
                }
            }

            for(const playerCostToTarget of playerCostToTargetEffects) {
                if(playerCostToTarget.match(target)) {
                    targetCost += playerCostToTarget.amount;
                }
            }
        }

        return targetCost;
    }

    markUsedReducers(playingType: PlayType | undefined, card: DrawCard, target: any = null): void {
        const matchingReducers = this.costReducers.filter((reducer) => reducer.canReduce(playingType as PlayType, card, target));
        matchingReducers.forEach((reducer) => {
            reducer.markUsed();
            if(reducer.isExpired()) {
                this.removeCostReducer(reducer);
            }
        });
    }

    registerAbilityMax(maxIdentifier: string, limit: any): void {
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
        this.declaredConflictOpportunities[ConflictType.Military] = 0;
        this.declaredConflictOpportunities[ConflictType.Political] = 0;
        this.declaredConflictOpportunities[ConflictType.Passed] = 0;
        this.declaredConflictOpportunities[ConflictType.Forced] = 0;
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

        let display: any = 'a card';
        if(
            (card.isFaceup() && source !== Location.Hand) ||
            [
                Location.PlayArea,
                Location.DynastyDiscardPile,
                Location.ConflictDiscardPile,
                Location.RemovedFromGame
            ].includes(target as Location)
        ) {
            display = card;
        }

        this.game.addMessage('{0} manually moves {1} from their {2} to their {3}', this, display, source, target);
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    isLegalLocationForCard(card: BaseCard | undefined, location: string): boolean {
        if(!card) {
            return false;
        }

        if(this.additionalPiles[location]) {
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
            category = (card.printedType as CardType) || card.type;
        }

        if(category === CardType.Character) {
            category = card.isDynasty ? 'dynastyCharacter' : 'conflictCharacter';
        }

        return !!legalLocations[category]?.includes(location as Location);
    }

    promptForAttachment(card: DrawCard, playingType?: string): void {
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType ?? ''));
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
        return this.getEffects(EffectName.ChangePlayerGloryModifier).reduce(
            (total: number, value: number) => total + value,
            0
        );
    }

    get skillModifier(): number {
        return this.getEffects(EffectName.ChangePlayerSkillModifier).reduce(
            (total: number, value: number) => total + value,
            0
        );
    }

    honorGained(round: number | null = null, phase: string | null = null, onlyPositive: boolean = false): number {
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

    resetHonorEvents(round: number, phase: string): void {
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

    hasAffinity(trait: string, context?: AbilityContext): boolean {
        if(!this.checkRestrictions('haveAffinity', context)) {
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

    claimImperialFavor(favorType?: string): void {
        if(this.opponent) {
            this.opponent.loseImperialFavor();
        }
        const sovereign = (this.game.gameMode === GameModes.Emerald || this.game.gameMode === GameModes.Sanctuary) ? 'Empress\'' : 'Emperor\'s';
        if(this.game.gameMode === GameModes.Skirmish) {
            this.imperialFavor = 'both';
            this.game.addMessage('{0} claims the ' + sovereign + ' favor!', this);
            return;
        }
        if(favorType && favorType !== FavorType.Both) {
            this.imperialFavor = favorType;
            this.game.addMessage('{0} claims the ' + sovereign + ' {1} favor!', this, favorType);
            return;
        }

        const handlers = ['military', 'political'].map((type) => {
            return () => {
                this.imperialFavor = type;
                this.game.addMessage('{0} claims the ' + sovereign + ' {1} favor!', this, type);
            };
        });
        this.game.promptWithHandlerMenu(this, {
            activePromptTitle: 'Which side of the Imperial Favor would you like to claim?',
            source: 'Imperial Favor',
            choices: ['Military', 'Political'],
            handlers: handlers
        });
    }

    loseImperialFavor(): void {
        this.imperialFavor = '';
    }

    selectDeck(deck: any): void {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;
        if(deck.stronghold.length > 0) {
            this.stronghold = new StrongholdCard(this, deck.stronghold[0]);
        }
        this.faction = deck.faction;
    }

    moveCard(card: BaseCard, targetLocation: string, options: any = {}): void {
        this.removeCardFromPile(card);

        if(targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        const targetPile = this.getSourceList(targetLocation);

        if(!this.isLegalLocationForCard(card, targetLocation) || (targetPile && targetPile.includes(card))) {
            return;
        }

        const location = card.location;

        if(
            location === Location.PlayArea ||
            (card.type === CardType.Holding &&
                card.isInProvince() &&
                !this.game.getProvinceArray().includes(targetLocation as Location))
        ) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for(const attachment of (card as DrawCard).attachments || []) {
                attachment.leavesPlay(targetLocation);
                attachment.owner.moveCard(
                    attachment,
                    attachment.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
                );
            }

            card.leavesPlay(targetLocation);
            card.controller = this;
        } else if(targetLocation === Location.PlayArea) {
            (card as DrawCard).setDefaultController(this);
            card.controller = this;
            if(card.type === CardType.Attachment) {
                this.promptForAttachment(card as DrawCard);
                return;
            }
        } else if(location === Location.BeingPlayed && card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if(card.type === CardType.Holding && this.game.getProvinceArray().includes(targetLocation as Location)) {
            card.controller = this;
        } else {
            card.controller = card.owner;
        }

        if(this.game.getProvinceArray().includes(targetLocation as Location)) {
            if([Location.DynastyDeck].includes(location as Location)) {
                card.facedown = true;
            }
            if(!this.takenDynastyMulligan && card.isDynasty) {
                card.facedown = false;
            }
            targetPile.push(card);
        } else if([Location.ConflictDeck, Location.DynastyDeck].includes(targetLocation as Location) && !options.bottom) {
            targetPile.unshift(card);
        } else if(
            [Location.ConflictDiscardPile, Location.DynastyDiscardPile, Location.RemovedFromGame].includes(
                targetLocation as Location
            )
        ) {
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
        }

        card.moveTo(targetLocation as Location);
    }

    removeCardFromPile(card: BaseCard): void {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        const originalLocation = card.location;
        let originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    getTotalIncome(): number {
        return this.game.gameMode === GameModes.Skirmish ? 6 : (this.stronghold?.cardData.fate ?? 0);
    }

    getTotalHonor(): number {
        return this.honorTracker.getTotalHonor();
    }

    getFate(): number {
        return this.fate;
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

    getSummaryForHand(list: BaseCard[], activePlayer: Player, hideWhenFaceup: boolean): CardSummary[] {
        if(this.optionSettings.sortHandByName) {
            return this.getSortedSummaryForCardList(list, activePlayer, hideWhenFaceup);
        }
        return this.getSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getSummaryForCardList(list: BaseCard[], activePlayer: Player, hideWhenFaceup?: boolean): CardSummary[] {
        return list.map((card: BaseCard) => {
            return card.getSummary(activePlayer, hideWhenFaceup ?? false);
        });
    }

    getSortedSummaryForCardList(list: BaseCard[], activePlayer: Player, hideWhenFaceup?: boolean): CardSummary[] {
        const cards = list.slice();
        cards.sort((a: BaseCard, b: BaseCard) => a.printedName.localeCompare(b.printedName));

        return cards.map((card: BaseCard) => {
            return card.getSummary(activePlayer, hideWhenFaceup ?? false);
        });
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

    setPrompt(prompt: any): void {
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
        this.game.addMessage('{0} reveals a bid of {1}', this, bid);
    }

    isTopConflictCardShown(activePlayer?: Player): boolean {
        const resolvedPlayer = activePlayer ?? this;

        if(resolvedPlayer.conflictDeck && resolvedPlayer.conflictDeck.length <= 0) {
            return false;
        }

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

    isTopDynastyCardShown(_activePlayer?: Player): boolean {
        if(this.dynastyDeck.length <= 0) {
            return false;
        }
        return this.anyEffect(EffectName.ShowTopDynastyCard);
    }

    resolveRingEffects(elements: string | string[], optional: boolean = true): void {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        optional = optional && elements.length === 1;
        let effects = elements.map((element) => RingEffects.contextFor(this, element, optional));
        effects = [...effects].sort((a: any, b: any) => {
            const aVal = this.firstPlayer ? a.ability.defaultPriority : -a.ability.defaultPriority;
            const bVal = this.firstPlayer ? b.ability.defaultPriority : -b.ability.defaultPriority;
            return aVal - bVal;
        });
        this.game.openSimultaneousEffectWindow(
            effects.map((context: any) => ({
                title: context.ability.title,
                handler: () => this.game.resolveAbility(context)
            }))
        );
    }

    isKihoPlayedThisConflict(context: AbilityContext, cardBeingPlayed: BaseCard): boolean {
        if(!context.game.currentConflict) {
            return false;
        }
        return (
            context.game.currentConflict.getNumberOfCardsPlayed(
                this,
                (card: any) => card.hasTrait('kiho') && card.uuid !== cardBeingPlayed.uuid
            ) > 0
        );
    }

    getStats() {
        return {
            fate: this.fate,
            honor: this.getTotalHonor(),
            conflictsRemaining: this.getConflictOpportunities(),
            militaryRemaining: this.getRemainingConflictOpportunitiesForType(ConflictType.Military),
            politicalRemaining: this.getRemainingConflictOpportunitiesForType(ConflictType.Political)
        };
    }

    getState(activePlayer: Player): PlayerState {
        const isActivePlayer = activePlayer === this;
        const promptState = isActivePlayer ? this.promptState.getState() : {};
        const state: PlayerState = {
            cardPiles: {
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                conflictDiscardPile: this.getSummaryForCardList(this.conflictDiscardPile, activePlayer),
                dynastyDiscardPile: this.getSummaryForCardList(this.dynastyDiscardPile, activePlayer),
                hand: this.getSummaryForHand(this.hand, activePlayer, true),
                removedFromGame: this.getSummaryForCardList(this.removedFromGame, activePlayer),
                provinceDeck: this.getSummaryForCardList(this.provinceDeck, activePlayer, true)
            },
            cardsPlayedThisConflict: this.game.currentConflict
                ? this.game.currentConflict.getNumberOfCardsPlayed(this)
                : NaN,
            disconnected: this.disconnected,
            faction: this.faction,
            firstPlayer: this.firstPlayer,
            hideProvinceDeck: this.hideProvinceDeck,
            id: this.id,
            imperialFavor: this.imperialFavor,
            left: this.left,
            name: this.name,
            numConflictCards: this.conflictDeck.length,
            numDynastyCards: this.dynastyDeck.length,
            numProvinceCards: this.provinceDeck.length,
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            promptedActionWindows: this.promptedActionWindows,
            provinces: {
                one: this.getSummaryForCardList(this.provinceOne, activePlayer, !this.readyToStart),
                two: this.getSummaryForCardList(this.provinceTwo, activePlayer, !this.readyToStart),
                three: this.getSummaryForCardList(this.provinceThree, activePlayer, !this.readyToStart),
                four: this.getSummaryForCardList(this.provinceFour, activePlayer, !this.readyToStart)
            },
            showBid: this.showBid,
            stats: this.getStats(),
            timerSettings: this.timerSettings,
            strongholdProvince: this.getSummaryForCardList(this.strongholdProvince, activePlayer),
            user: (() => {
                const { password: _password, email: _email, ...userSummary } = this.user;
                return userSummary;
            })()
        };

        if(this.additionalPiles && Object.keys(this.additionalPiles)) {
            Object.keys(this.additionalPiles).forEach((key) => {
                if(this.additionalPiles[key].cards.length > 0) {
                    state.cardPiles[key] = this.getSummaryForCardList(this.additionalPiles[key].cards, activePlayer);
                }
            });
        }

        if(this.showConflict) {
            state.showConflictDeck = true;
            state.cardPiles.conflictDeck = this.getSummaryForCardList(this.conflictDeck, activePlayer);
        }

        if(this.showDynasty) {
            state.showDynastyDeck = true;
            state.cardPiles.dynastyDeck = this.getSummaryForCardList(this.dynastyDeck, activePlayer);
        }

        if(this.role) {
            state.role = this.role.getSummary(activePlayer);
        }

        if(this.stronghold) {
            state.stronghold = this.stronghold.getSummary(activePlayer);
        }

        if(this.conflictDeck[0]) {
            state.conflictDeckTopCard = this.isTopConflictCardShown(activePlayer)
                ? this.conflictDeck[0].getSummary(activePlayer)
                : { facedown: true, ...activePlayer.getCardSelectionState(this.conflictDeck[0]) };
        }

        if(this.dynastyDeck[0]) {
            state.dynastyDeckTopCard = this.isTopDynastyCardShown(activePlayer)
                ? this.dynastyDeck[0].getSummary(activePlayer)
                : { facedown: true, ...activePlayer.getCardSelectionState(this.dynastyDeck[0]) };
        }

        if(this.clock) {
            state.clock = this.clock.getState();
        }

        return Object.assign(state, promptState);
    }

    getShortSummary() {
        return {
            name: this.name,
            faction: this.faction
        };
    }
}

export default Player;
