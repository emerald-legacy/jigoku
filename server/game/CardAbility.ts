import * as AbilityLimit from './AbilityLimit.js';
import type { AbilityLimit as IAbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import { ResolvableAbility } from './ResolvableAbility.js';
import type { ResolvableAbilityProperties } from './ResolvableAbility.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import { Location, CardType, EffectName, Phase, Blocker } from './Constants.js';
import { initiateDuel } from './DuelHelper.js';
import type BaseCard from './BaseCard.js';
import { GameObject } from './GameObject.js';
import type { AbilityContext } from './AbilityContext.js';
import type { InitiateDuel, OwnContextCallback } from './Interfaces.js';
import { msg, type MessageArgs, type MsgArg } from './GameChat.js';
import type { Cost } from './costs/Cost.js';
import { joinEffectMessages } from './GameActions/GameAction.js';

export interface CardAbilityProperties<Context extends AbilityContext = AbilityContext> extends ResolvableAbilityProperties<Context> {
    title?: string;
    limit?: IAbilityLimit;
    location?: Location | Location[];
    printedAbility?: boolean;
    cannotBeCancelled?: boolean;
    cannotTargetFirst?: boolean;
    firstPlayerChoosesFirst?: boolean;
    cannotBeMirrored?: boolean;
    max?: IAbilityLimit;
    abilityIdentifier?: string;
    origin?: BaseCard;
    condition?: (context: AbilityContext) => boolean;
    /** An "If …" before the dash: a triggering condition, which copies (The Mirror's Gaze) ignore. */
    ifCondition?: (context: AbilityContext) => boolean;
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    /** A format whose `{0}` is the target, or a message without positions (`msg` template). */
    chatText?: string | OwnContextCallback<[context: Context], MessageArgs | undefined>;
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

export class CardAbility extends ResolvableAbility {
    declare properties: CardAbilityProperties;
    override title?: string;
    override limit: IAbilityLimit;
    location: Location[];
    override printedAbility: boolean;
    override cannotBeCancelled?: boolean;
    declare cannotTargetFirst: boolean;
    override cannotBeMirrored: boolean;
    override max?: IAbilityLimit;
    abilityIdentifier: string;
    override maxIdentifier: string;
    override origin?: BaseCard;
    /** With a duel, its challenger check is part of it. */
    condition?: (context: AbilityContext) => boolean;
    ifCondition?: (context: AbilityContext) => boolean;

    constructor(card: BaseCard, properties: CardAbilityProperties) {
        // a duel's condition and targets go on a copy, so a copy of this ability starts from the properties as written
        const withDuel = initiateDuel(card, properties);
        super(card, withDuel);
        this.properties = properties;
        this.condition = withDuel.condition;
        this.ifCondition = properties.ifCondition;

        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.limit.registerEvents(card.game);
        this.limit.ability = this;
        this.location = this.buildLocation(card, properties.location);
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.cannotBeCancelled = properties.cannotBeCancelled;
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
        this.firstPlayerChoosesFirst = !!properties.firstPlayerChoosesFirst;
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

    override meetsRequirements(context: AbilityContext, ignoredBlockers: Blocker[] = []): Blocker {
        // keywords are switched by the keyword itself (hasKeyword)
        const blanked = this.printedAbility
            ? this.card.isBlank()
            : !this.isKeywordAbility() && this.card.anyEffect(EffectName.LoseGainedAbilities);
        if(blanked) {
            return Blocker.Blanked;
        }

        if(this.isTriggeredAbility() && !this.card.canTriggerAbilities(context, ignoredBlockers)) {
            return Blocker.CannotTrigger;
        }

        if(this.card.type === CardType.Event && this.card.isDrawCard()) {
            // resolving an event again (The Mirror's Gaze, Hand to Hand) isn't playing it (RRG Resolve an Ability) …
            if(!ignoredBlockers.includes(Blocker.CannotPlay) && !this.card.canPlay(context, context.playType)) {
                return Blocker.CannotPlay;
            }
            // … but its "Play only if" is a play restriction, which a copy must meet too
            if(!this.card.meetsPlayConditions(context)) {
                return Blocker.ConditionNotMet;
            }
        }

        if(!ignoredBlockers.includes(Blocker.IfConditionNotMet) && this.ifCondition && !this.ifCondition(context)) {
            return Blocker.IfConditionNotMet;
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

        if(!ignoredBlockers.includes(Blocker.LimitedAlreadyPlayed) && this.breaksLimitedRule(context)) {
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

    override getCosts(context: AbilityContext, playCosts = true, triggerCosts = true): Cost[] {
        let costs = super.getCosts(context, playCosts);
        // "an additional cost to trigger an ability": keywords aren't triggered abilities
        const withTriggerCosts = triggerCosts && !this.isKeywordAbility();
        if(!context.subResolution && withTriggerCosts && context.player.anyEffect(EffectName.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.player
                .getEffects(EffectName.AdditionalTriggerCost)
                .map((effect) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if(!context.subResolution && withTriggerCosts && context.source.anyEffect(EffectName.AdditionalTriggerCost)) {
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

    override getReducedCost(context: AbilityContext): number {
        return this.reducedFateCost(context);
    }

    isInValidLocation(context: AbilityContext): boolean {
        return this.card.type === CardType.Event
            ? context.player.isCardInPlayableLocation(context.source, context.playType)
            : this.location.includes(this.card.location);
    }

    /** Where a card is played from, for the chat: a card underneath another one is "set aside" by it. */
    getLocationMessage(card: BaseCard): string {
        if(card.isUnderneath()) {
            return card.host?.location === Location.PlayArea ? `cards set aside by ${card.host.name}` : 'out of play area';
        }
        return card.location;
    }

    override displayMessage(context: AbilityContext, messageVerb = context.source.type === CardType.Event ? 'plays' : 'uses'): void {
        if(
            context.source.type === CardType.Event &&
            context.source.isConflict &&
            context.source.location !== Location.Hand &&
            context.source.location !== Location.BeingPlayed
        ) {
            this.game.addMessage(msg`${context.player} plays ${context.source} from ${context.source.controller === context.player ? 'their' : 'their opponent\'s'} ${this.getLocationMessage(context.source)}`);
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
                    if(paid instanceof GameObject && paid.isCard() && paid.isFacedown()) {
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
        let effectMessage: string | undefined;
        let effectArgs: MsgArg[] = [];
        if(typeof effect === 'function') {
            [effectMessage, effectArgs] = effect(context) ?? [undefined, []];
        } else if(effect) {
            effectMessage = effect;
            effectArgs.push(context.chatTarget());
        }
        if(!effectMessage) {
            const gameActions = this.getGameActions(context).filter(({ action, overrides }) => action.hasLegalTarget(context, overrides));
            if(gameActions.length > 0) {
                [effectMessage, effectArgs] = joinEffectMessages(context, gameActions);
            }
        }

        if(effectMessage) {
            // to
            messageArgs.push(' to ');
            // discard Stoic Gunso
            messageArgs.push({ message: this.game.gameChat.formatMessage(effectMessage, effectArgs) });
        }
        this.game.addMessage(['{0}{1}{2}{3}{4}{5}{6}{7}{8}', messageArgs]);
    }

    override isCardPlayed(): boolean {
        return !this.isKeywordAbility() && this.card.getType() === CardType.Event;
    }

    override isStep(): boolean {
        return false;
    }

    override isTriggeredAbility(): boolean {
        return true;
    }

    override isCardAbilityInstance(): this is CardAbility {
        return true;
    }

    isCardAction(): this is CardAction {
        return false;
    }
}

