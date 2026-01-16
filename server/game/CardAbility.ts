import * as AbilityLimit from './AbilityLimit';
import AbilityDsl from './abilitydsl';
import ThenAbility from './ThenAbility';
import * as Costs from './Costs';
import { Locations, CardTypes, EffectNames, Players } from './Constants';
import { initiateDuel } from './DuelHelper';
import type Game from './game';
import type BaseCard from './basecard';
import type { AbilityContext } from './AbilityContext';

interface CardAbilityProperties {
    title?: string;
    limit?: any;
    location?: Locations | Locations[];
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

const DefaultLocationForType: Record<string, Locations> = {
    event: Locations.Hand,
    holding: Locations.Provinces,
    province: Locations.Provinces,
    role: Locations.Role,
    stronghold: Locations.StrongholdProvince
};

class CardAbility extends ThenAbility {
    title?: string;
    limit: any;
    abilityCost: any;
    location: Locations[];
    printedAbility: boolean;
    cannotBeCancelled?: boolean;
    cannotTargetFirst: boolean;
    cannotBeMirrored: boolean;
    max?: any;
    abilityIdentifier: string;
    maxIdentifier: string;
    origin?: BaseCard;

    constructor(game: Game, card: BaseCard, properties: CardAbilityProperties) {
        if (properties.initiateDuel) {
            initiateDuel(game, card, properties);
        }
        super(game, card, properties);

        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.limit.registerEvents(game);
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
        if (!this.abilityIdentifier) {
            this.abilityIdentifier = this.printedAbility ? this.card.id + '1' : '';
        }
        this.maxIdentifier = this.card.name + this.abilityIdentifier;

        if (this.max) {
            this.card.owner.registerAbilityMax(this.maxIdentifier, this.max);
        }

        if (card.getType() === CardTypes.Event && !this.isKeywordAbility()) {
            this.cost = this.cost.concat(Costs.payReduceableFateCost());
        }
    }

    buildLocation(card: BaseCard, location?: Locations | Locations[]): Locations[] {
        let defaultedLocation: Locations | Locations[] = location || DefaultLocationForType[card.getType()] || Locations.PlayArea;

        if (!Array.isArray(defaultedLocation)) {
            defaultedLocation = [defaultedLocation];
        }

        if (defaultedLocation.some((loc) => loc === Locations.Provinces)) {
            defaultedLocation = defaultedLocation.filter((loc) => loc !== Locations.Provinces);
            defaultedLocation = defaultedLocation.concat(this.game.getProvinceArray());
        }

        return defaultedLocation;
    }

    meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []): string {
        if (this.card.isBlank() && this.printedAbility) {
            return 'blank';
        }

        if (
            (this.isTriggeredAbility() && !this.card.canTriggerAbilities(context, ignoredRequirements)) ||
            (this.card.type === CardTypes.Event && !this.card.canPlay(context, context.playType))
        ) {
            return 'cannotTrigger';
        }

        if (this.isKeywordAbility() && !this.card.canInitiateKeywords(context)) {
            return 'cannotInitiate';
        }

        if (!ignoredRequirements.includes('limit') && this.limit.isAtMax(context.player)) {
            return 'limit';
        }

        if (!ignoredRequirements.includes('max') && this.max && context.player.isAbilityAtMax(this.maxIdentifier)) {
            return 'max';
        }

        if (this.isCardPlayed() && this.card.isLimited() && context.player.limitedPlayed >= context.player.maxLimited) {
            return 'limited';
        }

        if (
            !ignoredRequirements.includes('phase') &&
            !this.isKeywordAbility() &&
            this.card.isDynasty &&
            this.card.type === CardTypes.Event &&
            context.game.currentPhase !== 'dynasty'
        ) {
            return 'phase';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    getCosts(context: AbilityContext, playCosts = true, triggerCosts = true): any[] {
        let costs = super.getCosts(context, playCosts);
        if (!context.subResolution && triggerCosts && context.player.anyEffect(EffectNames.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.player
                .getEffects(EffectNames.AdditionalTriggerCost)
                .map((effect: any) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if (!context.subResolution && triggerCosts && context.source.anyEffect(EffectNames.AdditionalTriggerCost)) {
            const additionalTriggerCosts = context.source
                .getEffects(EffectNames.AdditionalTriggerCost)
                .map((effect: any) => effect(context));
            costs = costs.concat(...additionalTriggerCosts);
        }
        if (!context.subResolution && playCosts && context.player.anyEffect(EffectNames.AdditionalPlayCost)) {
            const additionalPlayCosts = context.player
                .getEffects(EffectNames.AdditionalPlayCost)
                .map((effect: any) => effect(context));
            return costs.concat(...additionalPlayCosts);
        }
        return costs;
    }

    getReducedCost(context: AbilityContext): number {
        const fateCost = this.cost.find((cost: any) => cost.getReducedCost);
        return fateCost ? fateCost.getReducedCost(context) : 0;
    }

    isInValidLocation(context: AbilityContext): boolean {
        return this.card.type === CardTypes.Event
            ? context.player.isCardInPlayableLocation(context.source, context.playType)
            : this.location.includes(this.card.location as Locations);
    }

    getLocationMessage(location: string, context: AbilityContext): string {
        if (location.match(/^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/i)) {
            // it's a uuid
            const source = context.game.findAnyCardInPlayByUuid(location);
            if (source) {
                return `cards set aside by ${source.name}`;
            }
            return 'out of play area';
        }
        return location;
    }

    displayMessage(context: AbilityContext, messageVerb = context.source.type === CardTypes.Event ? 'plays' : 'uses'): void {
        if (
            context.source.type === CardTypes.Event &&
            context.source.isConflict &&
            context.source.location !== Locations.Hand &&
            context.source.location !== Locations.BeingPlayed
        ) {
            this.game.addMessage(
                '{0} plays {1} from {2} {3}',
                context.player,
                context.source,
                context.source.controller === context.player ? 'their' : "their opponent's",
                this.getLocationMessage(context.source.location, context)
            );
        }

        if (this.properties.message) {
            let messageArgs = this.properties.messageArgs;
            if (typeof messageArgs === 'function') {
                messageArgs = messageArgs(context);
            }
            if (!Array.isArray(messageArgs)) {
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
        if (origin === context.source) {
            origin = undefined;
        }
        // Player1 plays Assassination
        const gainedAbility = origin ? "'s gained ability from " : '';
        const messageArgs: any[] = [context.player, ' ' + messageVerb + ' ', context.source, gainedAbility, origin];
        const costMessages = this.cost
            .map((cost: any) => {
                if (cost.getCostMessage && cost.getCostMessage(context)) {
                    let card: any = context.costs[cost.getActionName(context)];
                    if (card && card.isFacedown && card.isFacedown()) {
                        card = 'a facedown card';
                    }
                    let [format, args]: [string, any[]] = ['ERROR - MISSING COST MESSAGE', [' ', ' ']];
                    [format, args] = cost.getCostMessage(context);
                    return { message: this.game.gameChat.formatMessage(format, [card].concat(args)) };
                }
            })
            .filter((obj: any) => obj);
        if (costMessages.length > 0) {
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
        if (!effectMessage) {
            const gameActions = this.getGameActions(context).filter((gameAction: any) => gameAction.hasLegalTarget(context));
            if (gameActions.length > 0) {
                // effects with multiple game actions really need their own effect message
                [effectMessage, extraArgs] = gameActions[0].getEffectMessage(context);
            }
        } else {
            effectArgs.push(context.target || context.ring || context.source);
            extraArgs = this.properties.effectArgs;
        }

        if (extraArgs) {
            if (typeof extraArgs === 'function') {
                extraArgs = extraArgs(context);
            }
            effectArgs = effectArgs.concat(extraArgs);
        }

        if (effectMessage) {
            // to
            messageArgs.push(' to ');
            // discard Stoic Gunso
            messageArgs.push({ message: this.game.gameChat.formatMessage(effectMessage, effectArgs) });
        }
        this.game.addMessage('{0}{1}{2}{3}{4}{5}{6}{7}{8}', ...messageArgs);
    }

    isCardPlayed(): boolean {
        return !this.isKeywordAbility() && this.card.getType() === CardTypes.Event;
    }

    isTriggeredAbility(): boolean {
        return true;
    }
}

export = CardAbility;
