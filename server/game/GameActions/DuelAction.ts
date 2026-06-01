import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, Durations, EventNames, Locations, type DuelTypes } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { Duel } from '../Duel.js';
import type { Event } from '../Events/Event.js';
import { DuelFlow } from '../gamesteps/DuelFlow.js';
import type Player from '../Player.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { type GameAction } from './GameAction.js';

export interface DuelProperties extends CardActionProperties {
    type: DuelTypes;
    challenger?: DrawCard;
    challengerCondition?: (card: DrawCard, context: TriggeredAbilityContext) => boolean;
    requiresConflict?: boolean;
    gameAction: GameAction | ((duel: Duel, context: AbilityContext) => GameAction);
    message?: string;
    messageArgs?: (duel: Duel, context: AbilityContext) => unknown | unknown[];
    costHandler?: (context: AbilityContext, prompt: unknown) => void;
    statistic?: (card: DrawCard, duelRules: 'currentSkill' | 'printedSkill' | 'skirmish') => number;
    challengerEffect?: unknown;
    targetEffect?: unknown;
    refuseGameAction?: GameAction;
    refusalMessage?: string;
    refusalMessageArgs?: (context: AbilityContext) => unknown | unknown[];
}

type ResolvedDuelProperties = DuelProperties & { challenger: DrawCard };

export class DuelAction extends CardGameAction {
    name = 'duel';
    eventName = EventNames.OnDuelInitiated;
    targetType = [CardTypes.Character];

    defaultProperties: DuelProperties = {
        type: undefined as unknown as DuelTypes,
        gameAction: null as unknown as GameAction
    };

    getProperties(context: AbilityContext, additionalProperties = {}): ResolvedDuelProperties {
        const properties = super.getProperties(context, additionalProperties) as DuelProperties;
        return Object.assign(properties, { challenger: properties.challenger ?? context.source });
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        const properties = this.getProperties(context);
        if(!Array.isArray(properties.target)) {
            return [
                'initiate a ' + properties.type.toString() + ' duel : {0} vs. {1}',
                [properties.challenger, properties.target]
            ];
        }

        const indices = properties.target.map((_, idx) => `{${idx + 1}}`);
        return [
            'initiate a ' + properties.type.toString() + ' duel : {0} vs. ' + indices.join(' and '),
            [properties.challenger, ...properties.target]
        ];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        if(!context.player.opponent) {
            return false;
        }

        const properties = this.getProperties(context, additionalProperties);
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(card.hasNoDuels() || properties.challenger.hasNoDuels()) {
            return false;
        }
        if(card === properties.challenger) {
            return false; //cannot duel yourself
        }
        if(!card.checkRestrictions('duel', context)) {
            return false;
        }

        return !!(
            properties.challenger &&
            !properties.challenger.hasDash(properties.type) &&
            card.location === Locations.PlayArea &&
            !card.hasDash(properties.type)
        );
    }

    resolveDuel(duel: Duel, context: AbilityContext, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const gameAction =
            typeof properties.gameAction === 'function' ? properties.gameAction(duel, context) : properties.gameAction;
        const isNoAction = !!(gameAction as unknown as { isNoAction?: boolean })?.isNoAction;
        if(gameAction && !isNoAction && gameAction.hasLegalTarget(context)) {
            const [message, messageArgs] = properties.message
                ? [properties.message, properties.messageArgs ? ([] as unknown[]).concat(properties.messageArgs(duel, context) as unknown[]) : []]
                : gameAction.getEffectMessage(context);
            context.game.addMessage('Duel Effect: ' + message, ...messageArgs);
            gameAction.resolve(undefined, context);
        } else {
            context.game.addMessage('The duel has no effect');
        }
    }

    honorCosts(prompt: unknown, context: AbilityContext, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.costHandler) {
            properties.costHandler(context, prompt);
        }
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const { target, refuseGameAction, refusalMessage, refusalMessageArgs } = this.getProperties(
            context,
            additionalProperties
        );
        const addDuelEventsHandler = () => {
            const cards = (target as DrawCard[]).filter((card) => this.canAffect(card, context));
            if(cards.length === 0) {
                return;
            }
            const event = this.createEvent(null, context, additionalProperties);
            this.updateEvent(event, cards, context, additionalProperties);
            events.push(event);
        };
        if(refuseGameAction && refuseGameAction.hasLegalTarget(context, additionalProperties)) {
            context.game.promptWithHandlerMenu(context.player.opponent as Player, {
                activePromptTitle: 'Do you wish to refuse the duel?',
                context: context,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        if(refusalMessage) {
                            const refusalArgs = refusalMessageArgs ? ([] as unknown[]).concat(refusalMessageArgs(context) as unknown[]) : [];
                            context.game.addMessage(refusalMessage, ...refusalArgs);
                        } else {
                            context.game.addMessage(
                                '{0} chooses to refuse the duel and {1}',
                                context.player.opponent,
                                refuseGameAction.getEffectMessage(context)
                            );
                        }
                        refuseGameAction.addEventsToArray(events, context, additionalProperties);
                    },
                    addDuelEventsHandler
                ]
            });
        } else {
            addDuelEventsHandler();
        }
    }

    addPropertiesToEvent(event: Event, cards: unknown, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        let resolvedCards: DrawCard | DrawCard[] = cards as DrawCard | DrawCard[];
        if(!resolvedCards) {
            resolvedCards = this.getProperties(context, additionalProperties).target as DrawCard | DrawCard[];
        }
        if(!Array.isArray(resolvedCards)) {
            resolvedCards = [resolvedCards as DrawCard];
        }

        event.cards = resolvedCards;
        event.context = context;
        event.duelType = properties.type;
        event.challenger = properties.challenger;
        event.duelTarget = properties.target;

        const duel = new Duel(
            context.game,
            properties.challenger,
            resolvedCards,
            properties.type,
            properties,
            properties.statistic,
            context.player
        );
        event.duel = duel;
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        const context: AbilityContext = (event.context as AbilityContext);
        const cards: DrawCard[] = event.cards as DrawCard[];
        const properties = this.getProperties(context, additionalProperties);
        if(
            properties.challenger.location !== Locations.PlayArea ||
            cards.every((card: DrawCard) => card.location !== Locations.PlayArea)
        ) {
            context.game.addMessage(
                'The duel cannot proceed as at least one participant for each side has to be in play'
            );
            return;
        }
        const duel: Duel = event.duel as Duel;
        if(properties.challengerEffect) {
            context.game.actions
                .cardLastingEffect({
                    effect: properties.challengerEffect,
                    duration: Durations.Custom,
                    until: {
                        onDuelFinished: (event) => event.duel === duel
                    }
                })
                .resolve(properties.challenger, context);
        }
        if(properties.targetEffect) {
            context.game.actions
                .cardLastingEffect({
                    effect: properties.targetEffect,
                    duration: Durations.Custom,
                    until: {
                        onDuelFinished: (event) => event.duel === duel
                    }
                })
                .resolve(properties.target, context);
        }
        context.game.queueStep(
            new DuelFlow(
                context.game,
                duel,
                (duel: Duel) => this.resolveDuel(duel, context, additionalProperties),
                properties.costHandler
                    ? (prompt: unknown) => this.honorCosts(prompt, context, additionalProperties)
                    : undefined
            )
        );
    }

    checkEventCondition(event: Event, additionalProperties: Record<string, unknown> = {}): boolean {
        return (event.cards as DrawCard[]).some((card: DrawCard) => this.canAffect(card, (event.context as AbilityContext), additionalProperties));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const mockDuel = new Duel(
            context.game,
            properties.challenger,
            [],
            properties.type,
            properties,
            properties.statistic,
            context.player
        );
        const gameAction =
            typeof properties.gameAction === 'function'
                ? properties.gameAction(mockDuel, context)
                : properties.gameAction;
        return !!(gameAction && gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties));
    }
}
