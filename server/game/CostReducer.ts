import type { AbilityContext } from './AbilityContext.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { CardTypes, PlayTypes } from './Constants.js';
import type Game from './Game.js';
import type Player from './Player.js';

export type CostReducerProps = {
    cardType?: CardTypes;
    costFloor?: number;
    limit?: AbilityLimit;
    playingTypes?: PlayTypes;
    amount?: number | ((card: BaseCard, player: Player) => number);
    match?: (card: DrawCard, source: BaseCard) => boolean;
    targetCondition?: (target: BaseCard, source: BaseCard, context: AbilityContext) => boolean;
};

export class CostReducer {
    uses = 0;
    private amount: number | ((card: BaseCard, player: Player) => number);
    private costFloor: number;
    private match?: (card: DrawCard, source: BaseCard) => boolean;
    private cardType?: CardTypes;
    private targetCondition?: (target: BaseCard, source: BaseCard, context: AbilityContext<any>) => boolean;
    private limit?: AbilityLimit;
    private playingTypes?: Array<PlayTypes>;

    constructor(
        private game: Game,
        private source: BaseCard,
        properties: CostReducerProps
    ) {
        this.amount = properties.amount || 1;
        this.costFloor = properties.costFloor || 0;
        this.match = properties.match;
        this.cardType = properties.cardType;
        this.targetCondition = properties.targetCondition;
        this.playingTypes =
            properties.playingTypes &&
            (Array.isArray(properties.playingTypes) ? properties.playingTypes : [properties.playingTypes]);
        this.limit = properties.limit;
        if(this.limit) {
            this.limit.registerEvents(game);
        }
    }

    public canReduce(playingType: PlayTypes, card: BaseCard, target?: BaseCard, ignoreType = false): boolean {
        if(this.limit && this.limit.isAtMax(this.source.controller)) {
            return false;
        } else if(!ignoreType && this.cardType && card.getType() !== this.cardType) {
            return false;
        } else if(this.playingTypes && !this.playingTypes.includes(playingType)) {
            return false;
        }
        const context = this.game.getFrameworkContext(card.controller);
        return this.checkMatch(card) && this.checkTargetCondition(context, target);
    }

    public getAmount(card: BaseCard, player: Player): number {
        return typeof this.amount === 'function' ? this.amount(card, player) : this.amount;
    }

    public markUsed(): void {
        this.limit?.increment(this.source.controller);
    }

    public isExpired(): boolean {
        return !!this.limit && this.limit.isAtMax(this.source.controller) && !this.limit.isRepeatable();
    }

    public getCostFloor(): number {
        return this.costFloor;
    }

    public unregisterEvents(): void {
        this.limit?.unregisterEvents(this.game);
    }

    private checkMatch(card: BaseCard) {
        return !this.match || this.match(card as DrawCard, this.source);
    }

    private checkTargetCondition(context: AbilityContext, target?: BaseCard): boolean {
        return !this.targetCondition || (!!target && this.targetCondition(target, this.source, context));
    }
}
