import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { resolveChoosingPlayer } from './resolveChoosingPlayer.js';
import { Players, type EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { GameAction } from './GameAction.js';
import type { HandlerMenuOption } from '../gamesteps/HandlerMenuPrompt.js';

export interface CardMenuProperties<C extends AbilityContext = AbilityContext> extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    cards: DrawCard[];
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    options?: HandlerMenuOption[];
    targets?: boolean;
    /** The chat line once a card is chosen. */
    message?: (context: C, card: DrawCard, chooser: Player) => MessageArgs;
    subActionProperties?: (card: DrawCard) => Record<string, unknown>;
    gameAction: GameAction;
    gameActionHasLegalTarget?: (context: AbilityContext) => boolean;
}

export class CardMenuAction<C extends AbilityContext = AbilityContext> extends CardGameAction<
    CardMenuProperties<C>,
    EventName,
    C,
    'activePromptTitle' | 'targets' | 'cards' | 'subActionProperties' | 'cardCondition'
> {
    effect = 'choose a target for {0}';
    defaultProperties = {
        activePromptTitle: 'Select a card:',
        targets: false,
        cards: [],
        subActionProperties: (card: DrawCard) => ({ target: card }),
        cardCondition: () => true
    };

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.cards.some((c) =>
            properties.gameAction.canAffect(
                card,
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(c))
            )
        );
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.options) {
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

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const cardCondition = (card: DrawCard, context: C) =>
            properties.gameAction.hasLegalTarget(
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(card))
            ) && properties.cardCondition(card, context);
        if(
            !this.hasLegalTarget(context, additionalProperties) ||
            properties.cards.length === 0 && (properties.options ?? []).length === 0
        ) {
            return;
        }
        const player = resolveChoosingPlayer(context, properties.player, properties.targets);
        if(!player) {
            return;
        }
        context.game.promptWithHandlerMenu(player, {
            context,
            activePromptTitle: properties.activePromptTitle,
            cards: properties.cards,
            options: properties.options,
            target: properties.target,
            cardCondition: (card: DrawCard) => cardCondition(card, context),
            cardHandler: (card: DrawCard): void => {
                properties.gameAction.addEventsToArray(
                    events,
                    context,
                    Object.assign({}, additionalProperties, properties.subActionProperties(card))
                );
                if(properties.message) {
                    context.game.addMessage(properties.message(context, card, player));
                }
            }
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return (
            properties.targets ||
            properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
