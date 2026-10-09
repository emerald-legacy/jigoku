import * as AbilityLimit from './AbilityLimit.js';
import type { AbilityLimit as IAbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import { ThenAbility } from './ThenAbility.js';
import type { ThenAbilityProperties } from './ThenAbility.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import { Location, CardType, EffectName, Phase, Blocker } from './Constants.js';
import { initiateDuel } from './DuelHelper.js';
import BaseCard from './BaseCard.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { AbilityContext } from './AbilityContext.js';
import type { EffectArg, InitiateDuel, OwnContextCallback } from './Interfaces.js';
import { msg, type MessageArgs, type MsgArg } from './GameChat.js';
import type { Cost } from './costs/Cost.js';

export interface CardAbilityProperties<C extends AbilityContext = AbilityContext> extends ThenAbilityProperties<C> {
    title?: string;
    limit?: IAbilityLimit;
    location?: Location | Location[];
    printedAbility?: boolean;
    cannotBeCancelled?: boolean;
    cannotTargetFirst?: boolean;
    cannotBeMirrored?: boolean;
    max?: IAbilityLimit;
    abilityIdentifier?: string;
    origin?: BaseCard;
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    /** A format whose `{0}` is the target, or a message without positions (`msg` template). */
    chatText?: string | OwnContextCallback<[context: C], MessageArgs>;
    chatTextArgs?: EffectArg | OwnContextCallback<[context: C], EffectArg>;
}

/** Cost results are open-ended; only those the chat can format are passed to it. */
function isMsgArg(value: unknown): value is MsgArg {
    if(value === undefined || value === null || typeof value === 'string' || typeof value === 'number') {
        return true;
    }
    if(Array.isArray(value)) {
        return value.every(isMsgArg);
    }
    return typeof value === 'object' && (
        ('name' in value && typeof value.name === 'string') ||
        ('getShortSummary' in value && typeof value.getShortSummary === 'function') ||
        'message' in value
    );
}

const DefaultLocationForType: Record<string, Location> = {
    event: Location.Hand,
    holding: Location.Provinces,
    province: Location.Provinces,
    role: Location.Role,
    stronghold: Location.StrongholdProvince
};

const printedAbilityCounts = new WeakMap<BaseCard, number>();

/** Numbers a card's printed abilities in the order they are created: the same for every copy of the card. */
function nextPrintedAbilityNumber(card: BaseCard): number {
    const number = (printedAbilityCounts.get(card) ?? 0) + 1;
    printedAbilityCounts.set(card, number);
    return number;
}

export class CardAbility extends ThenAbility {
    declare properties: CardAbilityProperties;
    title?: string;
    limit: IAbilityLimit;
    abilityCost: Cost[];
    location: Location[];
    printedAbility: boolean;
    cannotBeCancelled?: boolean;
    declare cannotTargetFirst: boolean;
    cannotBeMirrored: boolean;
    max?: IAbilityLimit;
    abilityIdentifier: string;
    maxIdentifier: string;
    origin?: BaseCard;

    constructor(card: BaseCard, properties: CardAbilityProperties) {
        if(properties.initiateDuel) {
            initiateDuel(card, properties);
        }
        super(card, properties);

        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.limit.registerEvents(card.game);
        this.limit.ability = this;
        this.abilityCost = this.cost;
        this.location = this.buildLocation(card, properties.location);
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.cannotBeCancelled = properties.cannotBeCancelled;
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
        this.cannotBeMirrored = !!properties.cannotBeMirrored;
        this.max = properties.max;
        this.abilityIdentifier = properties.abilityIdentifier || '';
        this.origin = properties.origin;
        if(!this.abilityIdentifier) {
            this.abilityIdentifier = this.printedAbility ? this.card.id + nextPrintedAbilityNumber(this.card) : '';
        }
        this.maxIdentifier = this.card.name + this.abilityIdentifier;

        if(this.max) {
            // a max is per player, across all copies by title, whoever owns the copy they use
            for(const player of this.game.getPlayers()) {
                player.registerAbilityMax(this.maxIdentifier, player === this.card.owner ? this.max : this.max.clone());
            }
        }

        if(card.getType() === CardType.Event && !this.isKeywordAbility()) {
            this.cost = this.cost.concat(payReduceableFateCost());
        }
    }

    buildLocation(card: BaseCard, location?: Location | Location[]): Location[] {
        let defaultedLocation: Location | Location[] = location || DefaultLocationForType[card.getType()] || Location.PlayArea;

        if(!Array.isArray(defaultedLocation)) {
            defaultedLocation = [defaultedLocation];
        }

        if(defaultedLocation.some((loc) => loc === Location.Provinces)) {
            defaultedLocation = defaultedLocation.filter((loc) => loc !== Location.Provinces);
            defaultedLocation = defaultedLocation.concat(this.game.getProvinceArray());
        }

        return defaultedLocation;
    }

    meetsRequirements(context: AbilityContext, ignoredBlockers: Blocker[] = []): Blocker {
        if(this.card.isBlank() && this.printedAbility) {
            return Blocker.Blanked;
        }

        if(
            (this.isTriggeredAbility() && !this.card.canTriggerAbilities(context, ignoredBlockers)) ||
            (this.card.type === CardType.Event && this.card.isDrawCard() && !this.card.canPlay(context, context.playType))
        ) {
            return Blocker.CannotTrigger;
        }

        if(this.isKeywordAbility() && !this.card.canInitiateKeywords(context)) {
            return Blocker.CannotInitiate;
        }

        if(!ignoredBlockers.includes(Blocker.LimitReached) && this.limit.isAtMax(context.player)) {
            return Blocker.LimitReached;
        }

        if(!ignoredBlockers.includes(Blocker.MaxReached) && this.max && context.player.isAbilityAtMax(this.maxIdentifier)) {
            return Blocker.MaxReached;
        }

        if(this.breaksLimitedRule(context)) {
            return Blocker.LimitedAlreadyPlayed;
        }

        if(
            !ignoredBlockers.includes(Blocker.WrongPhase) &&
            !this.isKeywordAbility() &&
            this.card.isDynasty &&
            this.card.type === CardType.Event &&
            context.game.currentPhase !== Phase.Dynasty
        ) {
            return Blocker.WrongPhase;
        }

        return super.meetsRequirements(context, ignoredBlockers);
    }

    getCosts(context: AbilityContext, playCosts = true, triggerCosts = true): Cost[] {
        let costs = super.getCosts(context, playCosts);
        if(!context.subResolution && triggerCosts && context.player.anyEffect(EffectName.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.player
                .getEffects(EffectName.AdditionalTriggerCost)
                .map((effect) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if(!context.subResolution && triggerCosts && context.source.anyEffect(EffectName.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.source
                .getEffects(EffectName.AdditionalTriggerCost)
                .map((effect) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if(!context.subResolution && playCosts && context.player.anyEffect(EffectName.AdditionalPlayCost)) {
            const additionalPlayCosts = context.player
                .getEffects(EffectName.AdditionalPlayCost)
                .map((effect) => effect(context));
            return costs.concat(...additionalPlayCosts);
        }
        return costs;
    }

    getReducedCost(context: AbilityContext): number {
        return this.reducedFateCost(context);
    }

    isInValidLocation(context: AbilityContext): boolean {
        return this.card.type === CardType.Event
            ? context.player.isCardInPlayableLocation(context.source, context.playType)
            : this.location.includes(this.card.location);
    }

    getLocationMessage(location: string, context: AbilityContext): string {
        if(location.match(/^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/i)) {
            // it's a uuid
            const source = context.game.findAnyCardInPlayByUuid(location);
            if(source) {
                return `cards set aside by ${source.name}`;
            }
            return 'out of play area';
        }
        return location;
    }

    displayMessage(context: AbilityContext, messageVerb = context.source.type === CardType.Event ? 'plays' : 'uses'): void {
        if(
            context.source.type === CardType.Event &&
            context.source.isConflict &&
            context.source.location !== Location.Hand &&
            context.source.location !== Location.BeingPlayed
        ) {
            this.game.addMessage(msg`${context.player} plays ${context.source} from ${context.source.controller === context.player ? 'their' : 'their opponent\'s'} ${this.getLocationMessage(context.source.location, context)}`);
        }

        if(this.properties.message) {
            const message = this.properties.message(context);
            if(message) {
                this.game.addMessage(message);
            }
            return;
        }
        let origin = context.ability && context.ability.origin;
        // if origin is the same as source then ignore it
        if(origin === context.source) {
            origin = undefined;
        }
        // Player1 plays Assassination
        const gainedAbility = origin ? '\'s gained ability from ' : '';
        const messageArgs: MsgArg[] = [context.player, ' ' + messageVerb + ' ', context.source, gainedAbility, origin];
        const costMessages = this.cost
            .map((cost) => {
                const costMsg = cost.getCostMessage && cost.getCostMessage(context);
                if(costMsg && costMsg.length !== 0) {
                    const paid = cost.getActionName ? context.costs[cost.getActionName(context)] : undefined;
                    let card: MsgArg = isMsgArg(paid) ? paid : undefined;
                    if(paid instanceof BaseCard && paid.isFacedown()) {
                        card = 'a facedown card';
                    }
                    const [format, args] = costMsg;
                    return { message: this.game.gameChat.formatMessage(format, [card].concat(args)) };
                }
                return undefined;
            })
            .filter((obj) => obj);
        if(costMessages.length > 0) {
            // ,
            messageArgs.push(', ');
            // paying 3 honor
            messageArgs.push(costMessages);
        } else {
            messageArgs.push('', '');
        }
        const effect = this.properties.chatText;
        let effectMessage = typeof effect === 'function' ? undefined : effect;
        let effectArgs: MsgArg[] = [];
        let extraArgs: MsgArg[] | EffectArg | ((context: AbilityContext) => EffectArg) | null | undefined = null;
        if(typeof effect === 'function') {
            [effectMessage, effectArgs] = effect(context);
        } else if(!effectMessage) {
            const gameActions = this.getGameActions(context).filter((gameAction: GameAction) => gameAction.hasLegalTarget(context));
            if(gameActions.length > 0) {
                // effects with multiple game actions really need their own effect message
                [effectMessage, extraArgs] = gameActions[0].getEffectMessage(context);
            }
        } else {
            effectArgs.push(context.chatTarget());
            extraArgs = this.properties.chatTextArgs;
        }

        if(extraArgs) {
            if(typeof extraArgs === 'function') {
                extraArgs = extraArgs(context);
            }
            effectArgs = effectArgs.concat(extraArgs);
        }

        if(effectMessage) {
            // to
            messageArgs.push(' to ');
            // discard Stoic Gunso
            messageArgs.push({ message: this.game.gameChat.formatMessage(effectMessage, effectArgs) });
        }
        this.game.addMessage('{0}{1}{2}{3}{4}{5}{6}{7}{8}', ...messageArgs);
    }

    isCardPlayed(): boolean {
        return !this.isKeywordAbility() && this.card.getType() === CardType.Event;
    }

    isTriggeredAbility(): boolean {
        return true;
    }

    isCardAbilityInstance(): this is CardAbility {
        return true;
    }

    isCardAction(): this is CardAction {
        return false;
    }
}

