import _ from 'underscore';

import { GameObject } from './GameObject';
import { Deck } from './Deck.js';
import AttachmentPrompt from './gamesteps/attachmentprompt.js';
import { clockFor } from './Clocks/ClockSelector.js';
import { CostReducer } from './CostReducer';
import * as GameActions from './GameActions/GameActions';
import { RingEffects } from './RingEffects.js';
import { PlayableLocation } from './PlayableLocation';
import { PlayerPromptState } from './PlayerPromptState.js';
import { RoleCard } from './RoleCard';
import { StrongholdCard } from './StrongholdCard.js';

import {
    AbilityTypes,
    CardTypes,
    ConflictTypes,
    Decks,
    EffectNames,
    EventNames,
    FavorTypes,
    Locations,
    Players,
    PlayTypes
} from './Constants';
import { GameModes } from '../GameModes';
import type Game from './game';
import type BaseCard from './basecard';
import type DrawCard from './drawcard';
import type Ring from './ring';
import type { ClockInterface } from './Clocks/types';
import type { AbilityContext } from './AbilityContext';

class Player extends GameObject {
    user: any;
    emailHash: string;
    id: string;
    owner: boolean;
    printedType: string;
    socket: any;
    disconnected: boolean;
    left: boolean;
    lobbyId: string | null;

    dynastyDeck: _.Underscore<DrawCard>;
    conflictDeck: _.Underscore<DrawCard>;
    provinceDeck: _.Underscore<BaseCard>;
    hand: _.Underscore<DrawCard>;
    cardsInPlay: _.Underscore<DrawCard>;
    strongholdProvince: _.Underscore<BaseCard>;
    provinceOne: _.Underscore<BaseCard>;
    provinceTwo: _.Underscore<BaseCard>;
    provinceThree: _.Underscore<BaseCard>;
    provinceFour: _.Underscore<BaseCard>;
    dynastyDiscardPile: _.Underscore<DrawCard>;
    conflictDiscardPile: _.Underscore<DrawCard>;
    removedFromGame: _.Underscore<BaseCard>;
    additionalPiles: Record<string, any>;
    underneathStronghold: _.Underscore<BaseCard>;

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
    honorEvents: Array<{ amount: number; phase: string; round: number }>;

    promptState: PlayerPromptState;
    opponent?: Player;
    preparedDeck: any;
    outsideTheGameCards: any;
    fate: number = 0;
    honor: number = 0;
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

        this.dynastyDeck = _([]);
        this.conflictDeck = _([]);
        this.provinceDeck = _([]);
        this.hand = _([]);
        this.cardsInPlay = _([]);
        this.strongholdProvince = _([]);
        this.provinceOne = _([]);
        this.provinceTwo = _([]);
        this.provinceThree = _([]);
        this.provinceFour = _([]);
        this.dynastyDiscardPile = _([]);
        this.conflictDiscardPile = _([]);
        this.removedFromGame = _([]);
        this.additionalPiles = {};
        this.underneathStronghold = _([]);

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
            new PlayableLocation(PlayTypes.PlayFromHand, this, Locations.Hand),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceOne),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceTwo),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceThree)
        ];
        if(this.game.gameMode !== GameModes.Skirmish) {
            this.playableLocations.push(
                new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceFour)
            );
            this.playableLocations.push(
                new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.StrongholdProvince)
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
        this.honorEvents = [];

        this.promptState = new PlayerPromptState(this);
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

    isCardUuidInList(list: _.Underscore<BaseCard>, card: BaseCard): boolean {
        return list.any((c) => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list: _.Underscore<BaseCard>, card: BaseCard): boolean {
        return list.any((c) => {
            return c.name === card.name;
        });
    }

    areCardsSelected(): boolean {
        return this.cardsInPlay.any((card) => {
            return (card as any).selected;
        });
    }

    removeCardByUuid(list: _.Underscore<BaseCard>, uuid: string): _.Underscore<BaseCard> {
        return _(
            list.reject((card) => {
                return card.uuid === uuid;
            })
        );
    }

    findCardByName(list: _.Underscore<BaseCard>, name: string): BaseCard | undefined {
        return this.findCard(list, (card) => card.name === name);
    }

    findCardByUuid(list: _.Underscore<BaseCard>, uuid: string): BaseCard | undefined {
        return this.findCard(list, (card) => card.uuid === uuid);
    }

    findCardInPlayByUuid(uuid: string): DrawCard | null {
        return this.findCard(this.cardsInPlay, (card) => card.uuid === uuid) as DrawCard | null;
    }

    findCard(cardList: _.Underscore<any>, predicate: (card: any) => boolean): any | undefined {
        const cards = this.findCards(cardList, predicate);
        if(!cards || cards.length === 0) {
            return undefined;
        }

        return cards[0];
    }

    findCards(cardList: _.Underscore<any>, predicate: (card: any) => boolean): any[] {
        if(!cardList) {
            return [];
        }

        const cardsToReturn: any[] = [];

        cardList.each((card: any) => {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            if(card.attachments) {
                cardsToReturn.push(...card.attachments.filter(predicate));
            }

            return cardsToReturn;
        });

        return cardsToReturn;
    }

    isTraitInPlay(trait: string): boolean {
        return this.game.allCards.some((card: any) => {
            return (
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Locations.PlayArea ||
                    (card.isProvince && !card.isBroken) ||
                    (card.isInProvince() && card.type === CardTypes.Holding))
            );
        });
    }

    isCharacterTraitInPlay(trait: string): boolean {
        return this.game.allCards.some((card: any) => {
            return (
                card.type === CardTypes.Character &&
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Locations.PlayArea ||
                    (card.isProvince && !card.isBroken) ||
                    (card.isInProvince() && card.type === CardTypes.Holding))
            );
        });
    }

    areLocationsAdjacent(locationA: Locations, locationB: Locations): boolean {
        switch(locationA) {
            case Locations.ProvinceOne:
                return locationB === Locations.ProvinceTwo;
            case Locations.ProvinceTwo:
                return locationB === Locations.ProvinceOne || locationB === Locations.ProvinceThree;
            case Locations.ProvinceThree:
                return locationB === Locations.ProvinceTwo || locationB === Locations.ProvinceFour;
            case Locations.ProvinceFour:
                return locationB === Locations.ProvinceThree;
            default:
                return false;
        }
    }

    getDynastyCardInProvince(location: string): DrawCard | undefined {
        const province = this.getSourceList(location);
        return province.find((card: any) => card.isDynasty);
    }

    getDynastyCardsInProvince(location: string): DrawCard[] {
        const province = this.getSourceList(location);
        let cards = province.filter((card: any) => card.isDynasty);
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        return cards;
    }

    getProvinceCardInProvince(location: string): BaseCard | undefined {
        const province = this.getSourceList(location);
        return province.find((card: any) => card.isProvince);
    }

    getProvinceCards(): BaseCard[] {
        const gameModeProvinceCount = this.game.gameMode === GameModes.Skirmish ? 3 : 5;
        const locations = [
            Locations.ProvinceOne,
            Locations.ProvinceTwo,
            Locations.ProvinceThree,
            Locations.ProvinceFour,
            Locations.StrongholdProvince
        ].slice(0, gameModeProvinceCount);
        return locations.map((location) => this.getProvinceCardInProvince(location) as BaseCard);
    }

    anyCardsInPlay(predicate: (card: DrawCard) => boolean): boolean {
        return this.game.allCards.some(
            (card: any) => card.controller === this && card.location === Locations.PlayArea && predicate(card)
        );
    }

    getAllConflictCards(predicate: (card: DrawCard) => boolean = () => true): DrawCard[] {
        return this.game.allCards.filter(
            (card: any) => card.owner === this && card.isConflict && predicate(card)
        ) as DrawCard[];
    }

    filterCardsInPlay(predicate: (card: DrawCard) => boolean): DrawCard[] {
        return this.game.allCards.filter(
            (card: any) => card.controller === this && card.location === Locations.PlayArea && predicate(card)
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
        const cards = properties.attacker ? [properties.attacker] : this.cardsInPlay.toArray();
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
        const setConflictDeclarationType = this.mostRecentEffect(EffectNames.SetConflictDeclarationType);
        const forceConflictDeclarationType = this.mostRecentEffect(EffectNames.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.mostRecentEffect(EffectNames.ProvideConflictDeclarationType);
        const maxConflicts = this.mostRecentEffect(EffectNames.SetMaxConflicts);
        const skirmishModeRRGLimit = this.game.gameMode === GameModes.Skirmish ? 1 : 0;
        if(maxConflicts) {
            return this.getConflictsWhenMaxIsSet(maxConflicts);
        }

        if(provideConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(provideConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictTypes.Passed] -
                this.declaredConflictOpportunities[ConflictTypes.Forced]
            );
        }

        if(forceConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(forceConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictTypes.Passed] -
                this.declaredConflictOpportunities[ConflictTypes.Forced]
            );
        }

        if(setConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(setConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictTypes.Passed] -
                this.declaredConflictOpportunities[ConflictTypes.Forced]
            );
        }

        return (
            this.getRemainingConflictOpportunitiesForType(ConflictTypes.Military) +
            this.getRemainingConflictOpportunitiesForType(ConflictTypes.Political) -
            this.declaredConflictOpportunities[ConflictTypes.Passed] -
            this.declaredConflictOpportunities[ConflictTypes.Forced] -
            skirmishModeRRGLimit
        );
    }

    getRemainingConflictOpportunitiesForType(type: string): number {
        return Math.max(0, this.getMaxConflictOpportunitiesForPlayerByType(type) - this.declaredConflictOpportunities[type]);
    }

    getLegalConflictTypes(properties: any): string[] {
        let types = properties.type || [ConflictTypes.Military, ConflictTypes.Political];
        types = Array.isArray(types) ? types : [types];
        const forcedDeclaredType =
            properties.forcedDeclaredType ||
            (this.game.currentConflict && this.game.currentConflict.forcedDeclaredType);
        if(forcedDeclaredType) {
            return [forcedDeclaredType].filter(
                (type: string) =>
                    types.includes(type) &&
                    this.getConflictOpportunities() > 0 &&
                    !this.getEffects(EffectNames.CannotDeclareConflictsOfType).includes(type)
            );
        }

        if(this.getConflictOpportunities() === 0) {
            return [];
        }

        return types.filter(
            (type: string) =>
                this.getRemainingConflictOpportunitiesForType(type) > 0 &&
                !this.getEffects(EffectNames.CannotDeclareConflictsOfType).includes(type)
        );
    }

    getConflictsWhenMaxIsSet(maxConflicts: number): number {
        return Math.max(0, maxConflicts - this.game.getConflicts(this).length);
    }

    getMaxConflictOpportunitiesForPlayerByType(type: string): number {
        let setConflictType = this.mostRecentEffect(EffectNames.SetConflictDeclarationType);
        let forceConflictType = this.mostRecentEffect(EffectNames.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.mostRecentEffect(EffectNames.ProvideConflictDeclarationType);
        const additionalConflictEffects = this.getEffects(EffectNames.AdditionalConflict);
        const additionalConflictsForType = additionalConflictEffects.filter((x: string) => x === type).length;
        let baselineAvailableConflicts =
            this.defaultAllowedConflicts[ConflictTypes.Military] +
            this.defaultAllowedConflicts[ConflictTypes.Political];
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
            if(setConflictType === ConflictTypes.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictTypes.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictTypes.Military];
            }
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(setConflictType && type !== setConflictType) {
            return 0;
        }
        if(forceConflictType && type === forceConflictType) {
            let declaredConflictsOfOtherType = 0;
            if(forceConflictType === ConflictTypes.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictTypes.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictTypes.Military];
            }
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(forceConflictType && type !== forceConflictType) {
            return 0;
        }
        if(provideConflictDeclarationType) {
            let declaredConflictsOfOtherType = 0;
            if(type === ConflictTypes.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictTypes.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictTypes.Military];
            }
            const availableAll =
                baselineAvailableConflicts +
                this.getEffects(EffectNames.AdditionalConflict).length -
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

    getProvinces(predicate: (card: any) => boolean = () => true): any[] {
        return this.game
            .getProvinceArray()
            .reduce(
                (array: any[], location: Locations) =>
                    array.concat(
                        this.getSourceList(location).filter(
                            (card: any) => card.type === CardTypes.Province && predicate(card)
                        )
                    ),
                []
            );
    }

    getNumberOfFaceupProvinces(predicate: (card: any) => boolean = () => true): number {
        return this.getProvinces((card) => card.isFaceup() && predicate(card)).length;
    }

    getNumberOfOpponentsFaceupProvinces(predicate: (card: any) => boolean = () => true): number {
        return (this.opponent && this.opponent.getNumberOfFaceupProvinces(predicate)) || 0;
    }

    getNumberOfFacedownProvinces(predicate: (card: any) => boolean = () => true): number {
        return this.getProvinces((card) => card.isFacedown() && predicate(card)).length;
    }

    getNumberOfOpponentsFacedownProvinces(predicate: (card: any) => boolean = () => true): number {
        return (this.opponent && this.opponent.getNumberOfFacedownProvinces(predicate)) || 0;
    }

    getNumberOfCardsInPlay(predicate: (card: any) => boolean): number {
        return this.game.allCards.reduce((num: number, card: any) => {
            if(card.controller === this && card.location === Locations.PlayArea && predicate(card)) {
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
                (array: BaseCard[], province: Locations) =>
                    array.concat(
                        this.getSourceList(province).filter(
                            (card: any) => card.getType() === CardTypes.Holding && card.isFaceup()
                        )
                    ),
                []
            );
    }

    isCardInPlayableLocation(card: BaseCard, playingType: string | null = null): boolean {
        if(card.getEffects(EffectNames.CanPlayFromOutOfPlay).filter((a: any) => a.player(this, card)).length > 0) {
            return true;
        }

        return this.playableLocations.some(
            (location) => (!playingType || location.playingType === playingType) && location.contains(card as DrawCard)
        );
    }

    findPlayType(card: BaseCard): string | undefined {
        if(card.getEffects(EffectNames.CanPlayFromOutOfPlay).filter((a: any) => a.player(this, card)).length > 0) {
            const effects = card.getEffects(EffectNames.CanPlayFromOutOfPlay).filter((a: any) => a.player(this, card));
            return effects[effects.length - 1].playType || PlayTypes.PlayFromHand;
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

        return this.findCard(this.cardsInPlay, (playCard: DrawCard) => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        });
    }

    drawCardsToHand(numCards: number): void {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.size()) {
            remainingCards = numCards - this.conflictDeck.size();
            const cards = this.conflictDeck.toArray();
            this.deckRanOutOfCards('conflict');
            this.game.queueSimpleStep(() => {
                for(const card of cards) {
                    this.moveCard(card, Locations.Hand);
                }
            });
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        } else {
            for(const card of this.conflictDeck.toArray().slice(0, numCards)) {
                this.moveCard(card, Locations.Hand);
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
            discardPile.each((card: BaseCard) => this.moveCard(card, deck + ' deck'));
            if(deck === 'dynasty') {
                this.shuffleDynastyDeck();
            } else {
                this.shuffleConflictDeck();
            }
        });
    }

    replaceDynastyCard(location: string): boolean {
        const province = this.getProvinceCardInProvince(location);

        if(!province || this.getSourceList(location).size() > 1) {
            return false;
        }
        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.replaceDynastyCard(location));
        } else {
            let refillAmount = 1;
            if(province) {
                const amount = (province as any).mostRecentEffect(EffectNames.RefillProvinceTo);
                if(amount) {
                    refillAmount = amount;
                }
            }

            this.refillProvince(location, refillAmount);
        }
        return true;
    }

    putTopDynastyCardInProvince(location: string, facedown: boolean = false): boolean {
        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.putTopDynastyCardInProvince(location, facedown));
        } else {
            const cardFromDeck = this.dynastyDeck.first();
            this.moveCard(cardFromDeck, location);
            (cardFromDeck as any).facedown = facedown;
            return true;
        }
        return true;
    }

    refillProvince(location: string, refillAmount: number): boolean {
        if(refillAmount <= 0) {
            return true;
        }

        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount));
            return true;
        }
        const province = this.getProvinceCardInProvince(location);
        const refillFunc = (province as any).mostRecentEffect(EffectNames.CustomProvinceRefillEffect);
        if(refillFunc) {
            refillFunc(this, province);
        } else {
            this.moveCard(this.dynastyDeck.first(), location);
        }

        this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount - 1));
        return true;
    }

    shuffleConflictDeck(): void {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.emitEvent(EventNames.OnDeckShuffled, { player: this, deck: Decks.ConflictDeck });
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    shuffleDynastyDeck(): void {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.emitEvent(EventNames.OnDeckShuffled, { player: this, deck: Decks.DynastyDeck });
        this.dynastyDeck = _(this.dynastyDeck.shuffle());
    }

    prepareDecks(): void {
        const deck = new Deck(this.deck);
        const preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction;
        this.provinceDeck = _(preparedDeck.provinceCards);
        if(preparedDeck.stronghold instanceof StrongholdCard) {
            this.stronghold = preparedDeck.stronghold;
        }
        if(preparedDeck.role instanceof RoleCard) {
            this.role = preparedDeck.role;
        }
        this.conflictDeck = _(preparedDeck.conflictCards);
        this.dynastyDeck = _(preparedDeck.dynastyCards);
        this.preparedDeck = preparedDeck;
        this.conflictDeck.each((card: DrawCard) => {
            if(card.type === CardTypes.Event) {
                for(const reaction of (card as any).abilities.reactions) {
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

    addPlayableLocation(type: PlayTypes | string, player: Player, location: Locations, cards: BaseCard[] = []): PlayableLocation | undefined {
        if(!player) {
            return;
        }
        const playableLocation = new PlayableLocation(type as PlayTypes, player, location, new Set(cards as DrawCard[]));
        this.playableLocations.push(playableLocation);
        return playableLocation;
    }

    removePlayableLocation(location: PlayableLocation): void {
        this.playableLocations = this.playableLocations.filter((l) => l !== location);
    }

    getAlternateFatePools(playingType: string, card: DrawCard, context?: AbilityContext): any[] {
        const effects = this.getEffects(EffectNames.AlternateFatePool);
        let alternateFatePools = effects
            .filter((match: any) => match(card) && match(card).getFate() > 0)
            .map((match: any) => match(card));

        if(context && context.source && (context.source as any).isTemptationsMaho()) {
            alternateFatePools.push(...this.cardsInPlay.filter((a: any) => a.type === 'character'));
        }
        if(context && context.source && (context.source as any).isTemptationsMaho()) {
            alternateFatePools = alternateFatePools.filter(
                (a: any) => a.printedType !== 'ring' && a.type === CardTypes.Character
            );
        }

        const rings = alternateFatePools.filter((a: any) => a.printedType === 'ring');
        const cards = alternateFatePools.filter((a: any) => a.printedType !== 'ring');
        if(
            !this.checkRestrictions('takeFateFromRings', context) ||
            (context && context.source && (context.source as any).isTemptationsMaho())
        ) {
            rings.forEach((ring: any) => {
                alternateFatePools = alternateFatePools.filter((a: any) => a !== ring);
            });
        }

        cards.forEach((card: any) => {
            if(!card.allowGameAction('removeFate') && card.type !== CardTypes.Attachment) {
                alternateFatePools = alternateFatePools.filter((a: any) => a !== card);
            }
        });

        return [...new Set(alternateFatePools)];
    }

    getMinimumCost(playingType: string, context: AbilityContext, target?: any, ignoreType: boolean = false): number {
        const card = context.source;
        const reducedCost = this.getReducedCost(playingType, card as DrawCard, target, ignoreType);
        const alternateFatePools = this.getAlternateFatePools(playingType, card as DrawCard, context);
        const alternateFate = alternateFatePools.reduce((total: number, pool: any) => total + pool.fate, 0);
        let triggeredCostReducers = 0;
        const fakeWindow = { addChoice: () => triggeredCostReducers++ };
        const fakeEvent = this.game.getEvent(EventNames.OnCardPlayed, { card: card, player: this, context: context });
        this.game.emit(EventNames.OnCardPlayed + ':' + AbilityTypes.Interrupt, fakeEvent, fakeWindow);
        const fakeResolverEvent = this.game.getEvent(EventNames.OnAbilityResolverInitiated, {
            card: card,
            player: this,
            context: context
        });
        this.game.emit(
            EventNames.OnAbilityResolverInitiated + ':' + AbilityTypes.Interrupt,
            fakeResolverEvent,
            fakeWindow
        );
        return Math.max(reducedCost - triggeredCostReducers - alternateFate, 0);
    }

    getReducedCost(playingType: PlayTypes | string, card: DrawCard, target?: any, ignoreType: boolean = false): number {
        const matchingReducers = this.costReducers.filter((reducer) =>
            reducer.canReduce(playingType as PlayTypes, card, target, ignoreType)
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

    getTotalCostModifiers(playingType: PlayTypes | string, card: DrawCard, target?: any, ignoreType: boolean = false): number {
        const baseCost = 0;
        const matchingReducers = this.costReducers.filter((reducer) =>
            reducer.canReduce(playingType as PlayTypes, card, target, ignoreType)
        );
        const reducedCost = matchingReducers.reduce((cost, reducer) => cost - reducer.getAmount(card, this), baseCost);
        return reducedCost;
    }

    getAvailableAlternateFate(playingType: string, context: AbilityContext): number {
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
            ? abilitySource.controller.getEffects(EffectNames.PlayerFateCostToTargetCard)
            : [];

        let targetCost = 0;
        for(const target of targets) {
            for(const cardCostToTarget of target.getEffects(EffectNames.FateCostToTarget)) {
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

    markUsedReducers(playingType: PlayTypes | string, card: DrawCard, target: any = null): void {
        const matchingReducers = this.costReducers.filter((reducer) => reducer.canReduce(playingType as PlayTypes, card, target));
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

        this.cardsInPlay.each((card: DrawCard) => {
            (card as any).new = false;
        });
        this.passedDynasty = false;
    }

    collectFate(): void {
        this.modifyFate(this.getTotalIncome());
        this.game.raiseEvent(EventNames.OnFateCollected, { player: this });
    }

    resetConflictOpportunities(): void {
        this.declaredConflictOpportunities[ConflictTypes.Military] = 0;
        this.declaredConflictOpportunities[ConflictTypes.Political] = 0;
        this.declaredConflictOpportunities[ConflictTypes.Passed] = 0;
        this.declaredConflictOpportunities[ConflictTypes.Forced] = 0;
    }

    showConflictDeck(): void {
        this.showConflict = true;
    }

    showDynastyDeck(): void {
        this.showDynasty = true;
    }

    getSourceList(source: string): _.Underscore<any> {
        switch(source) {
            case Locations.Hand:
                return this.hand;
            case Locations.ConflictDeck:
                return this.conflictDeck;
            case Locations.DynastyDeck:
                return this.dynastyDeck;
            case Locations.ConflictDiscardPile:
                return this.conflictDiscardPile;
            case Locations.DynastyDiscardPile:
                return this.dynastyDiscardPile;
            case Locations.RemovedFromGame:
                return this.removedFromGame;
            case Locations.PlayArea:
                return this.cardsInPlay;
            case Locations.ProvinceOne:
                return this.provinceOne;
            case Locations.ProvinceTwo:
                return this.provinceTwo;
            case Locations.ProvinceThree:
                return this.provinceThree;
            case Locations.ProvinceFour:
                return this.provinceFour;
            case Locations.StrongholdProvince:
                return this.strongholdProvince;
            case Locations.ProvinceDeck:
                return this.provinceDeck;
            case Locations.Provinces:
                return _(
                    (this.provinceOne.value() as any[]).concat(
                        this.provinceTwo.value(),
                        this.provinceThree.value(),
                        this.provinceFour.value(),
                        this.strongholdProvince.value()
                    )
                );
            case Locations.UnderneathStronghold:
                return this.underneathStronghold;
            default:
                if(source) {
                    if(!this.additionalPiles[source]) {
                        this.createAdditionalPile(source);
                    }
                    return this.additionalPiles[source].cards;
                }
                return _([]);
        }
    }

    createAdditionalPile(name: string, properties?: any): void {
        this.additionalPiles[name] = Object.assign({ cards: _([]) }, properties);
    }

    updateSourceList(source: string, targetList: _.Underscore<any>): void {
        switch(source) {
            case Locations.Hand:
                this.hand = targetList;
                break;
            case Locations.ConflictDeck:
                this.conflictDeck = targetList;
                break;
            case Locations.DynastyDeck:
                this.dynastyDeck = targetList;
                break;
            case Locations.ConflictDiscardPile:
                this.conflictDiscardPile = targetList;
                break;
            case Locations.DynastyDiscardPile:
                this.dynastyDiscardPile = targetList;
                break;
            case Locations.RemovedFromGame:
                this.removedFromGame = targetList;
                break;
            case Locations.PlayArea:
                this.cardsInPlay = targetList;
                break;
            case Locations.ProvinceOne:
                this.provinceOne = targetList;
                break;
            case Locations.ProvinceTwo:
                this.provinceTwo = targetList;
                break;
            case Locations.ProvinceThree:
                this.provinceThree = targetList;
                break;
            case Locations.ProvinceFour:
                this.provinceFour = targetList;
                break;
            case Locations.StrongholdProvince:
                this.strongholdProvince = targetList;
                break;
            case Locations.ProvinceDeck:
                this.provinceDeck = targetList;
                break;
            case Locations.UnderneathStronghold:
                this.underneathStronghold = targetList;
                break;
            default:
                if(this.additionalPiles[source]) {
                    this.additionalPiles[source].cards = targetList;
                }
        }
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
            (card as any).isProvince &&
            target !== Locations.ProvinceDeck &&
            this.getSourceList(target).any((card: any) => card.isProvince)
        ) {
            return;
        }

        let display: any = 'a card';
        if(
            (card.isFaceup() && source !== Locations.Hand) ||
            [
                Locations.PlayArea,
                Locations.DynastyDiscardPile,
                Locations.ConflictDiscardPile,
                Locations.RemovedFromGame
            ].includes(target as Locations)
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
            Locations.Hand,
            Locations.ConflictDeck,
            Locations.ConflictDiscardPile,
            Locations.RemovedFromGame
        ];
        const dynastyCardLocations = [
            ...this.game.getProvinceArray(),
            Locations.DynastyDeck,
            Locations.DynastyDiscardPile,
            Locations.RemovedFromGame,
            Locations.UnderneathStronghold
        ];
        const legalLocations: Record<string, Locations[]> = {
            stronghold: [Locations.StrongholdProvince],
            role: [Locations.Role],
            province: [...this.game.getProvinceArray(), Locations.ProvinceDeck],
            holding: dynastyCardLocations,
            conflictCharacter: [...conflictCardLocations, Locations.PlayArea],
            dynastyCharacter: [...dynastyCardLocations, Locations.PlayArea],
            event: [...new Set([...conflictCardLocations, ...dynastyCardLocations, Locations.BeingPlayed])],
            attachment: [...conflictCardLocations, Locations.PlayArea]
        };

        let type: CardTypes | string = card.type;
        if(location === Locations.DynastyDiscardPile || location === Locations.ConflictDiscardPile) {
            type = (card as any).printedType || card.type;
        }

        if(type === 'character') {
            type = (card as any).isDynasty ? 'dynastyCharacter' : 'conflictCharacter';
        }

        return legalLocations[type] && legalLocations[type].includes(location as Locations);
    }

    promptForAttachment(card: DrawCard, playingType?: string): void {
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType));
    }

    isAttackingPlayer(): boolean {
        return this.game.currentConflict && this.game.currentConflict.attackingPlayer === this;
    }

    isDefendingPlayer(): boolean {
        return this.game.currentConflict && this.game.currentConflict.defendingPlayer === this;
    }

    resetForConflict(): void {
        this.cardsInPlay.each((card: DrawCard) => {
            card.resetForConflict();
        });
    }

    get honorBid(): number {
        return Math.max(0, this.showBid + this.honorBidModifier);
    }

    get gloryModifier(): number {
        return this.getEffects(EffectNames.ChangePlayerGloryModifier).reduce(
            (total: number, value: number) => total + value,
            0
        );
    }

    get skillModifier(): number {
        return this.getEffects(EffectNames.ChangePlayerSkillModifier).reduce(
            (total: number, value: number) => total + value,
            0
        );
    }

    honorGained(round: number | null = null, phase: string | null = null, onlyPositive: boolean = false): number {
        return this.honorEvents
            .filter((event) => !round || event.round === round)
            .filter((event) => !phase || event.phase === phase)
            .filter((event) => !onlyPositive || event.amount > 0)
            .reduce((total, event) => total + event.amount, 0);
    }

    modifyFate(amount: number): void {
        this.fate = Math.max(0, this.fate + amount);
    }

    modifyHonor(amount: number): void {
        this.honor = Math.max(0, this.honor + amount);
        this.honorEvents.push({
            amount,
            phase: this.game.currentPhase,
            round: this.game.roundNumber
        });
    }

    resetHonorEvents(round: number, phase: string): void {
        this.honorEvents = this.honorEvents.filter((event) => event.round !== round && event.phase !== phase);
    }

    isMoreHonorable(): boolean {
        if(this.anyEffect(EffectNames.ConsideredLessHonorable)) {
            return false;
        }
        if(this.opponent && this.opponent.anyEffect(EffectNames.ConsideredLessHonorable)) {
            return true;
        }
        return this.opponent !== undefined && this.honor > this.opponent.honor;
    }

    isLessHonorable(): boolean {
        if(this.anyEffect(EffectNames.ConsideredLessHonorable)) {
            return true;
        }
        if(this.opponent && this.opponent.anyEffect(EffectNames.ConsideredLessHonorable)) {
            return false;
        }
        return this.opponent !== undefined && this.honor < this.opponent.honor;
    }

    hasAffinity(trait: string, context?: AbilityContext): boolean {
        if(!this.checkRestrictions('haveAffinity', context)) {
            return false;
        }

        for(const cheatedAffinities of this.getEffects(EffectNames.SatisfyAffinity)) {
            if(cheatedAffinities.includes(trait)) {
                return true;
            }
        }

        return this.cardsInPlay.some((card: DrawCard) => card.type === CardTypes.Character && card.hasTrait(trait));
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
        if(this.game.gameMode === GameModes.Skirmish) {
            this.imperialFavor = 'both';
            this.game.addMessage('{0} claims the Emperor\'s favor!', this);
            return;
        }
        if(favorType && favorType !== FavorTypes.Both) {
            this.imperialFavor = favorType;
            this.game.addMessage('{0} claims the Emperor\'s {1} favor!', this, favorType);
            return;
        }

        const handlers = ['military', 'political'].map((type) => {
            return () => {
                this.imperialFavor = type;
                this.game.addMessage('{0} claims the Emperor\'s {1} favor!', this, type);
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

        if(!this.isLegalLocationForCard(card, targetLocation) || (targetPile && targetPile.contains(card))) {
            return;
        }

        const location = card.location;

        if(
            location === Locations.PlayArea ||
            (card.type === CardTypes.Holding &&
                (card as any).isInProvince() &&
                !this.game.getProvinceArray().includes(targetLocation as Locations))
        ) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for(const attachment of (card as any).attachments || []) {
                attachment.leavesPlay(targetLocation);
                attachment.owner.moveCard(
                    attachment,
                    attachment.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile
                );
            }

            (card as any).leavesPlay(targetLocation);
            card.controller = this;
        } else if(targetLocation === Locations.PlayArea) {
            (card as any).setDefaultController(this);
            card.controller = this;
            if(card.type === CardTypes.Attachment) {
                this.promptForAttachment(card as DrawCard);
                return;
            }
        } else if(location === Locations.BeingPlayed && card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if(card.type === CardTypes.Holding && this.game.getProvinceArray().includes(targetLocation as Locations)) {
            card.controller = this;
        } else {
            card.controller = card.owner;
        }

        if(this.game.getProvinceArray().includes(targetLocation as Locations)) {
            if([Locations.DynastyDeck].includes(location as Locations)) {
                (card as any).facedown = true;
            }
            if(!this.takenDynastyMulligan && (card as any).isDynasty) {
                (card as any).facedown = false;
            }
            targetPile.push(card);
        } else if([Locations.ConflictDeck, Locations.DynastyDeck].includes(targetLocation as Locations) && !options.bottom) {
            targetPile.unshift(card);
        } else if(
            [Locations.ConflictDiscardPile, Locations.DynastyDiscardPile, Locations.RemovedFromGame].includes(
                targetLocation as Locations
            )
        ) {
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
        }

        card.moveTo(targetLocation as Locations);
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
        return this.honor;
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

    getSummaryForHand(list: _.Underscore<DrawCard>, activePlayer: Player, hideWhenFaceup: boolean): any[] {
        if(this.optionSettings.sortHandByName) {
            return this.getSortedSummaryForCardList(list, activePlayer, hideWhenFaceup);
        }
        return this.getSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getSummaryForCardList(list: _.Underscore<any>, activePlayer: Player, hideWhenFaceup?: boolean): any[] {
        return list.map((card: any) => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getSortedSummaryForCardList(list: _.Underscore<any>, activePlayer: Player, hideWhenFaceup?: boolean): any[] {
        const cards = list.map((card: any) => card);
        cards.sort((a: any, b: any) => a.printedName.localeCompare(b.printedName));

        return cards.map((card: any) => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card: BaseCard): any {
        return this.promptState.getCardSelectionState(card);
    }

    getRingSelectionState(ring: Ring): any {
        return this.promptState.getRingSelectionState(ring);
    }

    currentPrompt(): any {
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

        if(resolvedPlayer.conflictDeck && resolvedPlayer.conflictDeck.size() <= 0) {
            return false;
        }

        if(resolvedPlayer === this) {
            return (
                this.getEffects(EffectNames.ShowTopConflictCard).includes(Players.Any) ||
                this.getEffects(EffectNames.ShowTopConflictCard).includes(Players.Self)
            );
        }

        return (
            this.getEffects(EffectNames.ShowTopConflictCard).includes(Players.Any) ||
            this.getEffects(EffectNames.ShowTopConflictCard).includes(Players.Opponent)
        );
    }

    eventsCannotBeCancelled(): boolean {
        return this.anyEffect(EffectNames.EventsCannotBeCancelled);
    }

    isTopDynastyCardShown(_activePlayer?: Player): boolean {
        if(this.dynastyDeck.size() <= 0) {
            return false;
        }
        return this.anyEffect(EffectNames.ShowTopDynastyCard);
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
        return (
            context.game.currentConflict.getNumberOfCardsPlayed(
                this,
                (card: any) => card.hasTrait('kiho') && card.uuid !== cardBeingPlayed.uuid
            ) > 0
        );
    }

    getStats(): any {
        return {
            fate: this.fate,
            honor: this.getTotalHonor(),
            conflictsRemaining: this.getConflictOpportunities(),
            militaryRemaining: this.getRemainingConflictOpportunitiesForType(ConflictTypes.Military),
            politicalRemaining: this.getRemainingConflictOpportunitiesForType(ConflictTypes.Political)
        };
    }

    getState(activePlayer: Player): any {
        const isActivePlayer = activePlayer === this;
        const promptState = isActivePlayer ? this.promptState.getState() : {};
        const state: any = {
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
            numConflictCards: this.conflictDeck.size(),
            numDynastyCards: this.dynastyDeck.size(),
            numProvinceCards: this.provinceDeck.size(),
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
                if(this.additionalPiles[key].cards.size() > 0) {
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

        if(this.isTopConflictCardShown(activePlayer) && this.conflictDeck.first()) {
            state.conflictDeckTopCard = this.conflictDeck.first().getSummary(activePlayer);
        }

        if(this.isTopDynastyCardShown(activePlayer) && this.dynastyDeck.first()) {
            state.dynastyDeckTopCard = this.dynastyDeck.first().getSummary(activePlayer);
        }

        if(this.clock) {
            state.clock = this.clock.getState();
        }

        return Object.assign(state, promptState);
    }

    getShortSummary(): any {
        return {
            name: this.name,
            faction: this.faction
        };
    }
}

export = Player;
