import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, Duration, EventName, Location, type DuelType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { Duel } from '../Duel.js';
import type { Event } from '../Events/Event.js';
import { DuelFlow } from '../gamesteps/DuelFlow.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { targetList, type GameAction, type WithDefaults, type ActionEvent } from './GameAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';

function toArray(args: MsgArg | MsgArg[]): MsgArg[] {
    return Array.isArray(args) ? args : [args];
}

export interface DuelProperties extends CardActionProperties {
    type: DuelType;
    challenger?: DrawCard;
    challengerCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    requiresConflict?: boolean;
    gameAction: GameAction | ((duel: Duel, context: AbilityContext) => GameAction);
    message?: string;
    messageArgs?: (duel: Duel, context: AbilityContext) => MsgArg | MsgArg[];
    costHandler?: (context: AbilityContext, prompt: unknown) => void;
    statistic?: (card: DrawCard, duelRules: 'currentSkill' | 'printedSkill' | 'skirmish') => number;
    challengerEffect?: EffectFactory | EffectFactory[];
    targetEffect?: EffectFactory | EffectFactory[];
    refuseGameAction?: GameAction;
    refusalMessage?: string;
    refusalMessageArgs?: (context: AbilityContext) => MsgArg | MsgArg[];
}

export class DuelAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DuelProperties, EventName.OnDuelInitiated, C> {
    name = 'duel';
    eventName = EventName.OnDuelInitiated;
    targetType = [CardType.Character];


    getProperties(context: C, additionalProperties = {}): WithDefaults<DuelProperties, 'challenger'> {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { challenger: properties.challenger ?? context.source });
    }

    getEffectMessage(context: C): MessageArgs {
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

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
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
            card.location === Location.PlayArea &&
            !card.hasDash(properties.type)
        );
    }

    resolveDuel(duel: Duel, context: C, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const gameAction =
            typeof properties.gameAction === 'function' ? properties.gameAction(duel, context) : properties.gameAction;
        const isNoAction = !!gameAction?.isNoAction;
        if(gameAction && !isNoAction && gameAction.hasLegalTarget(context)) {
            const [message, messageArgs]: MessageArgs = properties.message
                ? [properties.message, properties.messageArgs ? toArray(properties.messageArgs(duel, context)) : []]
                : gameAction.getEffectMessage(context);
            context.game.addMessage('Duel Effect: ' + message, ...messageArgs);
            gameAction.resolve(undefined, context);
        } else {
            context.game.addMessage('The duel has no effect');
        }
    }

    honorCosts(prompt: unknown, context: C, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.costHandler) {
            properties.costHandler(context, prompt);
        }
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        const { target, refuseGameAction, refusalMessage, refusalMessageArgs } = this.getProperties(
            context,
            additionalProperties
        );
        const addDuelEventsHandler = () => {
            const cards = targetList(target).filter((card) => card.isDrawCard() && this.canAffect(card, context));
            if(cards.length === 0) {
                return;
            }
            const event = this.createEvent(null, context, additionalProperties);
            this.updateEvent(event, cards, context, additionalProperties);
            events.push(event);
        };
        const opponent = context.player.opponent;
        if(refuseGameAction && opponent && refuseGameAction.hasLegalTarget(context, additionalProperties)) {
            context.game.promptWithHandlerMenu(opponent, {
                activePromptTitle: 'Do you wish to refuse the duel?',
                context: context,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        if(refusalMessage) {
                            const refusalArgs = refusalMessageArgs ? toArray(refusalMessageArgs(context)) : [];
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

    addPropertiesToEvent(event: ActionEvent<EventName.OnDuelInitiated, C>, cards: BaseCard | BaseCard[] | null | undefined, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const resolvedCards = targetList(cards || properties.target).filter((card) => card.isDrawCard());

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

    eventHandler(event: ActionEvent<EventName.OnDuelInitiated, C>, additionalProperties: Record<string, unknown> = {}): void {
        const context: C = event.context;
        const cards: DrawCard[] = event.cards;
        const properties = this.getProperties(context, additionalProperties);
        if(
            properties.challenger.location !== Location.PlayArea ||
            cards.every((card: DrawCard) => card.location !== Location.PlayArea)
        ) {
            context.game.addMessage(
                'The duel cannot proceed as at least one participant for each side has to be in play'
            );
            return;
        }
        const duel: Duel = event.duel;
        if(properties.challengerEffect) {
            context.game.actions
                .cardLastingEffect({
                    effect: properties.challengerEffect,
                    duration: Duration.Custom,
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
                    duration: Duration.Custom,
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

    checkEventCondition(event: ActionEvent<EventName.OnDuelInitiated, C>, additionalProperties: Record<string, unknown> = {}): boolean {
        return event.cards.some((card: DrawCard) => this.canAffect(card, event.context, additionalProperties));
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: Record<string, unknown> = {}): boolean {
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
