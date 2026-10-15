import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type Player from '../Player.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, Duration, EventName, Location, type DuelType, RestrictionType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { Duel, type ResolvedDuel } from '../Duel.js';
import type { Event } from '../Events/Event.js';
import { DuelFlow } from '../gamesteps/DuelFlow.js';
import type { HonorBidPrompt } from '../gamesteps/HonorBidPrompt.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { targetList, type GameAction, type ActionEvent } from './GameAction.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';
import { CardLastingEffectAction } from './CardLastingEffectAction.js';

export interface DuelProperties<C extends AbilityContext = AbilityContext> extends CardActionProperties {
    type: DuelType;
    challenger?: DrawCard;
    challengerCondition?(card: DrawCard, context: C): boolean;
    requiresConflict?: boolean;
    /** Resolved only when the duel has a winner. */
    gameAction: GameAction | ((duel: ResolvedDuel, context: AbilityContext) => GameAction);
    onTie?: GameAction | ((duel: Duel, context: AbilityContext) => GameAction);
    /** What the chat says the duel does, after "Duel Effect: "; by default its game action's own text. */
    chatText?(context: C, duel: ResolvedDuel): MessageArgs;
    costHandler?(context: C, prompt: HonorBidPrompt): void;
    statistic?: (card: DrawCard, duelRules: 'currentSkill' | 'printedSkill' | 'skirmish') => number;
    challengerEffect?: EffectFactory | EffectFactory[];
    targetEffect?: EffectFactory | EffectFactory[];
    refuseGameAction?: GameAction;
    /** The chat line when the opponent refuses; by default "<refuser> chooses to refuse the duel and <refuseGameAction's text>". */
    refusalMessage?(context: C, refuser: Player): MessageArgs;
}

export class DuelAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DuelProperties, EventName.OnDuelInitiated, C> {
    override name = 'duel';
    override restriction = RestrictionType.Duel;
    override eventName = EventName.OnDuelInitiated;
    override targetType = [CardType.Character];

    override getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { challenger: properties.challenger ?? context.source });
    }

    protected override effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        const targets = targetList(properties.target);
        const indices = targets.map((_, idx) => `{${idx + 1}}`);
        return ['initiate a ' + properties.type.toString() + ' duel : {0} vs. ' + indices.join(' and '), targets];
    }

    protected override effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.getProperties(context, additionalProperties).challenger;
    }

    override canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
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
        const { gameAction: onWin, onTie, chatText } = this.getProperties(context, additionalProperties);
        const gameAction = duel.hasWinner()
            ? (typeof onWin === 'function' ? onWin(duel, context) : onWin)
            : (typeof onTie === 'function' ? onTie(duel, context) : onTie);
        if(gameAction && !gameAction.isNoAction && gameAction.hasLegalTarget(context)) {
            const [message, messageArgs]: MessageArgs = chatText && duel.hasWinner()
                ? chatText(context, duel)
                : gameAction.getEffectMessage(context);
            context.game.addMessage(['Duel Effect: ' + message, messageArgs]);
            gameAction.resolve(undefined, context);
        } else {
            context.game.addMessage(msg`The duel has no effect`);
        }
    }

    honorCosts(prompt: HonorBidPrompt, context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.costHandler) {
            properties.costHandler(context, prompt);
        }
    }

    override addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { target, refuseGameAction, refusalMessage } = this.getProperties(
            context,
            additionalProperties
        );
        const addDuelEventsHandler = () => {
            const cards = targetList(target).filter((card) => card.isDrawCard() && this.canAffect(card, context, additionalProperties));
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

    override addPropertiesToEvent(event: ActionEvent<EventName.OnDuelInitiated, C>, cards: BaseCard | BaseCard[] | null | undefined, context: C, additionalProperties: ActionOverrides = {}): void {
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

    override eventHandler(event: ActionEvent<EventName.OnDuelInitiated, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const cards = event.cards;
        const properties = this.getProperties(context, additionalProperties);
        if(
            properties.challenger.location !== Location.PlayArea ||
            cards.every((card) => card.location !== Location.PlayArea)
        ) {
            context.game.addMessage(
                msg`The duel cannot proceed as at least one participant for each side has to be in play`
            );
            return;
        }
        const duel = event.duel;
        if(properties.challengerEffect) {
            new CardLastingEffectAction({
                effect: properties.challengerEffect,
                duration: Duration.Custom,
                until: {
                    onDuelFinished: (event) => event.duel === duel
                }
            })
                .resolve(properties.challenger, context);
        }
        if(properties.targetEffect) {
            new CardLastingEffectAction({
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
                    ? (prompt: HonorBidPrompt) => this.honorCosts(prompt, context, additionalProperties)
                    : undefined
            )
        );
    }

    override checkEventCondition(event: ActionEvent<EventName.OnDuelInitiated, C>, additionalProperties: ActionOverrides = {}): boolean {
        return event.cards.some((card) => this.canAffect(card, event.context, additionalProperties));
    }

    override hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(typeof properties.gameAction !== 'function') {
            return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
        }
        // As if the challenger won: the result isn't known yet.
        const mockDuel = new Duel(
            context.game,
            properties.challenger,
            [],
            properties.type,
            properties,
            properties.statistic,
            context.player
        );
        mockDuel.winner = [properties.challenger];
        mockDuel.winningPlayer = context.player;
        return mockDuel.hasWinner() && properties.gameAction(mockDuel, context).hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }
}
