import { CostReducer, type CostReducerProps } from './CostReducer.js';
import { PlayableLocation } from './PlayableLocation.js';
import {
    AbilityType,
    CardType,
    EffectName,
    EventName,
    Location,
    Players,
    PlayType
} from './Constants.js';
import { GameModes } from '../GameModes.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { AbilityContext } from './AbilityContext.js';

export class PlayerCostManager {
    costReducers: CostReducer[] = [];
    playableLocations: PlayableLocation[];

    constructor(private readonly player: Player, private readonly game: Game) {
        this.playableLocations = [
            new PlayableLocation(PlayType.PlayFromHand, player, Location.Hand),
            new PlayableLocation(PlayType.PlayFromProvince, player, Location.ProvinceOne),
            new PlayableLocation(PlayType.PlayFromProvince, player, Location.ProvinceTwo),
            new PlayableLocation(PlayType.PlayFromProvince, player, Location.ProvinceThree)
        ];
        if(game.gameMode !== GameModes.Skirmish) {
            this.playableLocations.push(
                new PlayableLocation(PlayType.PlayFromProvince, player, Location.ProvinceFour)
            );
            this.playableLocations.push(
                new PlayableLocation(PlayType.PlayFromProvince, player, Location.StrongholdProvince)
            );
        }
    }

    addCostReducer(source: BaseCard, properties: CostReducerProps): CostReducer {
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

    isCardInPlayableLocation(card: BaseCard, playingType: PlayType | null = null): boolean {
        if(card.getEffects(EffectName.CanPlayFromOutOfPlay).filter((a) => a.player(this.player, card)).length > 0) {
            return true;
        }

        return this.playableLocations.some(
            (location) => (!playingType || location.playingType === playingType) && location.contains(card as DrawCard)
        );
    }

    findPlayType(card: BaseCard): PlayType | undefined {
        if(card.getEffects(EffectName.CanPlayFromOutOfPlay).filter((a) => a.player(this.player, card)).length > 0) {
            const effects = card.getEffects(EffectName.CanPlayFromOutOfPlay).filter((a) => a.player(this.player, card));
            return effects[effects.length - 1].playType || PlayType.PlayFromHand;
        }

        const location = this.playableLocations.find((location) => location.contains(card as DrawCard));
        if(location) {
            return location.playingType;
        }

        return undefined;
    }

    getAlternateFatePools(playingType: PlayType | undefined, card: DrawCard, context?: AbilityContext): any[] {
        const effects = this.player.getEffects(EffectName.AlternateFatePool);
        let alternateFatePools = effects
            .filter((match) => match(card) && match(card).getFate() > 0)
            .map((match) => match(card));

        if(context && context.source && context.source.isTemptationsMaho()) {
            alternateFatePools.push(...this.player.cardsInPlay.filter((a: DrawCard) => a.type === 'character'));
        }
        if(context && context.source && context.source.isTemptationsMaho()) {
            alternateFatePools = alternateFatePools.filter(
                (a: any) => a.printedType !== 'ring' && a.type === CardType.Character
            );
        }

        const rings = alternateFatePools.filter((a: any) => a.printedType === 'ring');
        const cards = alternateFatePools.filter((a: any) => a.printedType !== 'ring');
        if(
            !this.player.checkRestrictions('takeFateFromRings', context) ||
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
        const fakeEvent = this.game.getEvent(EventName.OnCardPlayed, { card: card, player: this.player, context: context });
        this.game.emit(EventName.OnCardPlayed + ':' + AbilityType.Interrupt, fakeEvent, fakeWindow);
        const fakeResolverEvent = this.game.getEvent(EventName.OnAbilityResolverInitiated, {
            card: card,
            player: this.player,
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
            .filter((a) => a.getAmount(card, this.player) < 0)
            .reduce((cost, reducer) => cost - reducer.getAmount(card, this.player), 0);
        const costDecreases = matchingReducers
            .filter((a) => a.getAmount(card, this.player) > 0)
            .reduce((cost, reducer) => cost + reducer.getAmount(card, this.player), 0);

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
        const reducedCost = matchingReducers.reduce((cost, reducer) => cost - reducer.getAmount(card, this.player), baseCost);
        return reducedCost;
    }

    getAvailableAlternateFate(playingType: PlayType | undefined, context: AbilityContext): number {
        const card = context.source as DrawCard;
        const alternateFatePools = this.getAlternateFatePools(playingType, card);
        const alternateFate = alternateFatePools.reduce((total: number, pool: any) => total + pool.fate, 0);
        return Math.max(alternateFate, 0);
    }

    getTargetingCost(abilitySource: BaseCard, targets: any): number {
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
}
