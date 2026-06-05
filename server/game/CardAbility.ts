import * as AbilityLimit from './AbilityLimit.js';
import ThenAbility from './ThenAbility.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import { Location, CardType, EffectName } from './Constants.js';
import { initiateDuel } from './DuelHelper.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { AbilityContext } from './AbilityContext.js';
import type { Cost } from './costs/Cost.js';

interface CardAbilityProperties {
    title?: string;
    limit?: any;
    location?: Location | Location[];
    printedAbility?: boolean;
    cannotBeCancelled?: boolean;
    cannotTargetFirst?: boolean;
    cannotBeMirrored?: boolean;
    max?: any;
    abilityIdentifier?: string;
    origin?: BaseCard;
    initiateDuel?: any;
    message?: string;
    messageArgs?: any;
    effect?: string;
    effectArgs?: any;
    [key: string]: any;
}

const DefaultLocationForType: Record<string, Location> = {
    event: Location.Hand,
    holding: Location.Provinces,
    province: Location.Provinces,
    role: Location.Role,
    stronghold: Location.StrongholdProvince
};

class CardAbility extends ThenAbility {
    title?: string;
    limit: any;
    abilityCost: Cost[];
    location: Location[];
    printedAbility: boolean;
    cannotBeCancelled?: boolean;
    declare cannotTargetFirst: boolean;
    cannotBeMirrored: boolean;
    max?: any;
    abilityIdentifier: string;
    maxIdentifier: string;
    origin?: BaseCard;

    constructor(card: BaseCard, properties: CardAbilityProperties) {
        if(properties.initiateDuel) {
            initiateDuel(card.game, card, properties);
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
            this.abilityIdentifier = this.printedAbility ? this.card.id + '1' : '';
        }
        this.maxIdentifier = this.card.name + this.abilityIdentifier;

        if(this.max) {
            this.card.owner.registerAbilityMax(this.maxIdentifier, this.max);
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

    meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []): string {
        if(this.card.isBlank() && this.printedAbility) {
            return 'blank';
        }

        if(
            (this.isTriggeredAbility() && !this.card.canTriggerAbilities(context, ignoredRequirements)) ||
            (this.card.type === CardType.Event && !(this.card as DrawCard).canPlay(context, context.playType))
        ) {
            return 'cannotTrigger';
        }

        if(this.isKeywordAbility() && !this.card.canInitiateKeywords(context)) {
            return 'cannotInitiate';
        }

        if(!ignoredRequirements.includes('limit') && this.limit.isAtMax(context.player)) {
            return 'limit';
        }

        if(!ignoredRequirements.includes('max') && this.max && context.player.isAbilityAtMax(this.maxIdentifier)) {
            return 'max';
        }

        if(this.isCardPlayed() && (this.card as DrawCard).isLimited() && context.player.limitedPlayed >= context.player.maxLimited) {
            return 'limited';
        }

        if(
            !ignoredRequirements.includes('phase') &&
            !this.isKeywordAbility() &&
            this.card.isDynasty &&
            this.card.type === CardType.Event &&
            context.game.currentPhase !== 'dynasty'
        ) {
            return 'phase';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    getCosts(context: AbilityContext, playCosts = true, triggerCosts = true): Cost[] {
        let costs = super.getCosts(context, playCosts);
        if(!context.subResolution && triggerCosts && context.player.anyEffect(EffectName.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.player
                .getEffects(EffectName.AdditionalTriggerCost)
                .map((effect: any) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if(!context.subResolution && triggerCosts && context.source.anyEffect(EffectName.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.source
                .getEffects(EffectName.AdditionalTriggerCost)
                .map((effect: any) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if(!context.subResolution && playCosts && context.player.anyEffect(EffectName.AdditionalPlayCost)) {
            const additionalPlayCosts = context.player
                .getEffects(EffectName.AdditionalPlayCost)
                .map((effect: any) => effect(context));
            return costs.concat(...additionalPlayCosts);
        }
        return costs;
    }

    getReducedCost(context: AbilityContext): number {
        const fateCost = this.cost.find(
            (cost): cost is Cost & { getReducedCost(context: AbilityContext): number } =>
                !!(cost as { getReducedCost?: unknown }).getReducedCost
        );
        return fateCost ? fateCost.getReducedCost(context) : 0;
    }

    isInValidLocation(context: AbilityContext): boolean {
        return this.card.type === CardType.Event
            ? context.player.isCardInPlayableLocation(context.source, context.playType)
            : this.location.includes(this.card.location as Location);
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
            this.game.addMessage(
                '{0} plays {1} from {2} {3}',
                context.player,
                context.source,
                context.source.controller === context.player ? 'their' : 'their opponent\'s',
                this.getLocationMessage(context.source.location, context)
            );
        }

        if(this.properties.message) {
            let messageArgs = this.properties.messageArgs;
            if(typeof messageArgs === 'function') {
                messageArgs = messageArgs(context);
            }
            if(!Array.isArray(messageArgs)) {
                messageArgs = [messageArgs];
            }
            const message = typeof this.properties.message === 'function'
                ? this.properties.message(context)
                : this.properties.message;
            this.game.addMessage(message, ...messageArgs);
            return;
        }
        let origin = context.ability && (context.ability as CardAbility).origin;
        // if origin is the same as source then ignore it
        if(origin === context.source) {
            origin = undefined;
        }
        // Player1 plays Assassination
        const gainedAbility = origin ? '\'s gained ability from ' : '';
        const messageArgs: unknown[] = [context.player, ' ' + messageVerb + ' ', context.source, gainedAbility, origin];
        const costMessages = this.cost
            .map((cost) => {
                const costMsg = cost.getCostMessage && cost.getCostMessage(context);
                if(costMsg && costMsg.length > 0) {
                    let card: any = context.costs[(cost.getActionName as (c: AbilityContext) => string)(context)];
                    if(card && card.isFacedown && card.isFacedown()) {
                        card = 'a facedown card';
                    }
                    const [format, args] = costMsg as [string, any[]];
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
        let effectMessage = this.properties.effect;
        let effectArgs: any[] = [];
        let extraArgs: any = null;
        if(!effectMessage) {
            const gameActions = this.getGameActions(context).filter((gameAction: GameAction) => gameAction.hasLegalTarget(context));
            if(gameActions.length > 0) {
                // effects with multiple game actions really need their own effect message
                [effectMessage, extraArgs] = gameActions[0].getEffectMessage(context);
            }
        } else {
            effectArgs.push(context.target || context.ring || context.source);
            extraArgs = this.properties.effectArgs;
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
}

export default CardAbility;
