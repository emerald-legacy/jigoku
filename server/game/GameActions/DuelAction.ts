import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type Player from '../Player.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, Duration, EventName, Location, type DuelType, RestrictionType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { Duel } from '../Duel.js';
import type { Event } from '../Events/Event.js';
import { DuelFlow } from '../gamesteps/DuelFlow.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { targetList, type GameAction, type ActionEvent } from './GameAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';

export interface DuelProperties extends CardActionProperties {
    type: DuelType;
    challenger?: DrawCard;
    challengerCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    requiresConflict?: boolean;
    gameAction: GameAction | ((duel: Duel, context: AbilityContext) => GameAction);
    /** What the chat says the duel does, after "Duel Effect: "; by default its game action's own text. */
    chatText?: (context: AbilityContext, duel: Duel) => MessageArgs;
    costHandler?: (context: AbilityContext, prompt: unknown) => void;
    statistic?: (card: DrawCard, duelRules: 'currentSkill' | 'printedSkill' | 'skirmish') => number;
    challengerEffect?: EffectFactory | EffectFactory[];
    targetEffect?: EffectFactory | EffectFactory[];
    refuseGameAction?: GameAction;
    /** The chat line when the opponent refuses; by default "<refuser> chooses to refuse the duel and <refuseGameAction's text>". */
    refusalMessage?: (context: AbilityContext, refuser: Player) => MessageArgs;
}

export class DuelAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DuelProperties, EventName.OnDuelInitiated, C> {
    name = 'duel';
    restriction = RestrictionType.Duel;
    eventName = EventName.OnDuelInitiated;
    targetType = [CardType.Character];

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { challenger: properties.challenger ?? context.source });
    }

    protected effectMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        const targets = targetList(properties.target);
        const indices = targets.map((_, idx) => `{${idx + 1}}`);
        return ['initiate a ' + properties.type.toString() + ' duel : {0} vs. ' + indices.join(' and '), targets];
    }

    protected effectMessageTarget(context: C): MsgArg {
        return this.getProperties(context).challenger;
    }

    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
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
        if(!card.checkRestrictions(RestrictionType.Duel, context)) {
            return false;
        }

        return (
            !properties.challenger.hasDash(properties.type) &&
            card.location === Location.PlayArea &&
            !card.hasDash(properties.type)
        );
    }

    resolveDuel(duel: Duel, context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const gameAction =
            typeof properties.gameAction === 'function' ? properties.gameAction(duel, context) : properties.gameAction;
        const isNoAction = !!gameAction.isNoAction;
        if(!isNoAction && gameAction.hasLegalTarget(context)) {
            const [message, messageArgs]: MessageArgs = properties.chatText
                ? properties.chatText(context, duel)
                : gameAction.getEffectMessage(context);
            context.game.addMessage('Duel Effect: ' + message, ...messageArgs);
            gameAction.resolve(undefined, context);
        } else {
            context.game.addMessage('The duel has no effect');
        }
    }

    honorCosts(prompt: unknown, context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.costHandler) {
            properties.costHandler(context, prompt);
        }
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { target, refuseGameAction, refusalMessage } = this.getProperties(
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
                options: [
                    {
                        text: 'Yes',
                        handler: () => {
                            if(refusalMessage) {
                                context.game.addMessage(refusalMessage(context, opponent));
                            } else {
                                context.game.addMessage(msg`${opponent} chooses to refuse the duel and ${context.game.gameChat.nested(refuseGameAction.getEffectMessage(context))}`);
                            }
                            refuseGameAction.addEventsToArray(events, context, additionalProperties);
                        }
                    },
                    { text: 'No', handler: addDuelEventsHandler }
                ]
            });
        } else {
            addDuelEventsHandler();
        }
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnDuelInitiated, C>, cards: BaseCard | BaseCard[] | null | undefined, context: C, additionalProperties: ActionOverrides = {}): void {
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

    eventHandler(event: ActionEvent<EventName.OnDuelInitiated, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const cards = event.cards;
        const properties = this.getProperties(context, additionalProperties);
        if(
            properties.challenger.location !== Location.PlayArea ||
            cards.every((card) => card.location !== Location.PlayArea)
        ) {
            context.game.addMessage(
                'The duel cannot proceed as at least one participant for each side has to be in play'
            );
            return;
        }
        const duel = event.duel;
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

    checkEventCondition(event: ActionEvent<EventName.OnDuelInitiated, C>, additionalProperties: ActionOverrides = {}): boolean {
        return event.cards.some((card) => this.canAffect(card, event.context, additionalProperties));
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
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
        return gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }
}
