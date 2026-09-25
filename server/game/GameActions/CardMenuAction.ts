import type { MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Players, type EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { GameAction, WithDefaults } from './GameAction.js';

export interface CardMenuProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    cards: DrawCard[];
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    choices?: string[];
    handlers?: ((...args: unknown[]) => unknown)[];
    targets?: boolean;
    message?: string;
    messageArgs?: (card: DrawCard, player: Player, cards: DrawCard[]) => MsgArg[];
    subActionProperties?: (card: DrawCard) => Record<string, unknown>;
    gameAction: GameAction;
    gameActionHasLegalTarget?: (context: AbilityContext) => boolean;
}

export class CardMenuAction<C extends AbilityContext = AbilityContext> extends CardGameAction<CardMenuProperties, EventName, C> {
    effect = 'choose a target for {0}';
    defaultProperties: Partial<CardMenuProperties> = {
        activePromptTitle: 'Select a card:',
        targets: false,
        cards: []
    };

    getProperties(context: C, additionalProperties = {}): WithDefaults<CardMenuProperties, 'subActionProperties' | 'cardCondition' | 'choices'> {
        const properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        return Object.assign(properties, {
            subActionProperties: properties.subActionProperties ?? ((card: DrawCard) => ({ target: card })),
            cardCondition: properties.cardCondition ?? (() => true),
            choices: properties.choices ?? []
        });
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.cards.some((c) =>
            properties.gameAction.canAffect(
                card,
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(c))
            )
        );
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(properties.handlers) {
            return true;
        }
        if(properties.gameActionHasLegalTarget) {
            return properties.gameActionHasLegalTarget(context);
        }
        return properties.cards.some((card) =>
            properties.gameAction.hasLegalTarget(
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(card))
            )
        );
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        let cardCondition = (card: DrawCard, context: C) =>
            properties.gameAction.hasLegalTarget(
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(card))
            ) && properties.cardCondition(card, context);
        if(
            !this.hasLegalTarget(context, additionalProperties) ||
            (properties.cards.length === 0 && properties.choices.length === 0) ||
            (properties.player === Players.Opponent && !context.player.opponent)
        ) {
            return;
        }
        let player: Player = (properties.player === Players.Opponent ? context.player.opponent : context.player) as Player;
        if(properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride;
        }
        let defaultProperties = {
            context: context,
            cardHandler: (card: DrawCard): void => {
                properties.gameAction.addEventsToArray(
                    events,
                    context,
                    Object.assign({}, additionalProperties, properties.subActionProperties(card))
                );
                if(properties.message && properties.messageArgs) {
                    let cards = properties.cards.filter((card) => cardCondition(card, context));
                    context.game.addMessage(properties.message, ...(properties.messageArgs(card, player, cards)));
                }
            }
        };
        context.game.promptWithHandlerMenu(player, { ...defaultProperties, ...properties, cardCondition });
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (
            properties.targets ||
            properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
