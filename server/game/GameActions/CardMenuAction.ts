import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { GameAction } from './GameAction.js';

export interface CardMenuProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    cards: DrawCard[];
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    choices?: string[];
    handlers?: ((...args: unknown[]) => unknown)[];
    targets?: boolean;
    message?: string;
    messageArgs?: (card: DrawCard, player: Player, cards: DrawCard[]) => unknown[];
    subActionProperties?: (card: DrawCard) => Record<string, unknown>;
    gameAction: GameAction;
    gameActionHasLegalTarget?: (context: AbilityContext) => boolean;
}

type ResolvedCardMenuProperties = CardMenuProperties & {
    subActionProperties: NonNullable<CardMenuProperties['subActionProperties']>;
    cardCondition: NonNullable<CardMenuProperties['cardCondition']>;
    choices: NonNullable<CardMenuProperties['choices']>;
};

export class CardMenuAction extends CardGameAction<CardMenuProperties> {
    effect = 'choose a target for {0}';
    defaultProperties: CardMenuProperties = {
        activePromptTitle: 'Select a card:',
        subActionProperties: (card) => ({ target: card }),
        targets: false,
        cards: [],
        choices: [],
        cardCondition: () => true,
        gameAction: null as unknown as GameAction
    };

    getProperties(context: AbilityContext, additionalProperties = {}): ResolvedCardMenuProperties {
        let properties = super.getProperties(context, additionalProperties) as ResolvedCardMenuProperties;
        properties.gameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.cards.some((c) =>
            properties.gameAction.canAffect(
                card,
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(c))
            )
        );
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
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

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        let cardCondition = (card: DrawCard, context: AbilityContext) =>
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
                    context.game.addMessage(properties.message, ...properties.messageArgs(card, player, cards));
                }
            }
        };
        context.game.promptWithHandlerMenu(player, Object.assign(defaultProperties, properties, { cardCondition }));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (
            properties.targets ||
            properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
