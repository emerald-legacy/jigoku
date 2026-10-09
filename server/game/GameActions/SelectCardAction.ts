import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { resolveChoosingPlayer } from './resolveChoosingPlayer.js';
import { CardSelector, type SingleCardMode } from '../CardSelector.js';
import type { BaseCardSelector } from '../CardSelectors/BaseCardSelector.js';
import { CardType, EffectName, Location, Players, TargetMode, type EventName, RestrictionType } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { GameAction } from './GameAction.js';
import type { EffectArg } from '../Interfaces.js';
import { isCardOfType, type CardOfType, type CardTypes } from '../types/CardOfType.js';

const isCardTypeList = (cardType: CardTypes): cardType is readonly CardType[] => Array.isArray(cardType);

/** `K` is the declared `cardType`, which fixes the class of card the callbacks receive. */
interface SelectCardBase<C extends AbilityContext, K extends CardTypes> extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    cardType?: K;
    controller?: Players;
    location?: Location | Location[];
    cardCondition?: (card: CardOfType<K>, context: C) => boolean;
    targets?: boolean;
    manuallyRaiseEvent?: boolean;
    gameAction: GameAction;
    selector?: BaseCardSelector;
    hidePromptIfSingleCard?: boolean;
    cancelHandler?: () => void;
    chatText?: string;
    chatTextArgs?: (context: C) => EffectArg[];
}

/** One card. An optional select that is skipped resolves with no target and no message. */
export interface SelectCardProperties<C extends AbilityContext = AbilityContext, K extends CardTypes = CardTypes> extends SelectCardBase<C, K> {
    mode?: SingleCardMode;
    numCards?: 1;
    /** The chat line once a card is chosen; `chooser` is who chose it. */
    message?: (context: C, card: CardOfType<K>, chooser: Player) => MessageArgs;
    subActionProperties?: (card: CardOfType<K>) => Record<string, unknown>;
}

/** `subActionProperties` gets one candidate at a time while it checks, and what was chosen once it resolves. Any mode is sound. */
export interface SelectCardsProperties<C extends AbilityContext = AbilityContext, K extends CardTypes = CardTypes> extends SelectCardBase<C, K> {
    mode?: TargetMode;
    numCards?: number;
    /** The chat line once the cards are chosen; `chooser` is who chose them. */
    message?: (context: C, cards: CardOfType<K>[], chooser: Player) => MessageArgs;
    subActionProperties?: (cards: CardOfType<K> | CardOfType<K>[]) => Record<string, unknown>;
}

/**
 * What the action works with: the card type is checked once, in `cardCondition`.
 * Callbacks taking the context use method syntax, so an action for a narrower context stays assignable.
 */
export interface SelectCardActionProperties<C extends AbilityContext = AbilityContext> extends Omit<SelectCardBase<C, CardTypes>, 'cardType' | 'cardCondition' | 'chatTextArgs'> {
    cardType?: CardType | CardType[];
    cardCondition?(card: BaseCard, context: C): boolean;
    chatTextArgs?(context: C): EffectArg[];
    mode?: TargetMode;
    numCards?: number;
    /** Nothing means no message. */
    message?(context: C, cards: BaseCard | BaseCard[], chooser: Player): MessageArgs | undefined;
    subActionProperties?: (cards: BaseCard | BaseCard[]) => Record<string, unknown>;
}

/** The selector only offers cards of the declared types, so the checks never reject one. */
function eraseBase<C extends AbilityContext, K extends CardTypes>(properties: SelectCardBase<C, K> & { mode?: TargetMode; numCards?: number }) {
    const isCard = isCardOfType(properties.cardType);
    const holds = (card: BaseCard): CardOfType<K> => {
        if(!isCard(card)) {
            throw new Error(`${card.name} is not a card this select can hold`);
        }
        return card;
    };
    const { cardType, cardCondition, ...rest } = properties;
    const erased: SelectCardActionProperties<C> = rest;
    if(cardType !== undefined) {
        erased.cardType = isCardTypeList(cardType) ? [...cardType] : cardType;
    }
    if(cardCondition) {
        erased.cardCondition = (card, context) => isCard(card) && cardCondition(card, context);
    }
    return { erased, holds };
}

export function eraseSelectCardProperties<C extends AbilityContext, K extends CardTypes>(properties: SelectCardProperties<C, K>): SelectCardActionProperties<C> {
    const { message, subActionProperties, ...base } = properties;
    const { erased, holds } = eraseBase(base);
    // a skipped optional select passes []
    if(message) {
        erased.message = (context, card, chooser) => Array.isArray(card) ? undefined : message(context, holds(card), chooser);
    }
    if(subActionProperties) {
        erased.subActionProperties = (card) => Array.isArray(card) ? { target: [] } : subActionProperties(holds(card));
    }
    return erased;
}

export function eraseSelectCardsProperties<C extends AbilityContext, K extends CardTypes>(properties: SelectCardsProperties<C, K>): SelectCardActionProperties<C> {
    const { message, subActionProperties, ...base } = properties;
    const { erased, holds } = eraseBase(base);
    const chosen = (cards: BaseCard | BaseCard[]) => Array.isArray(cards) ? cards.map(holds) : holds(cards);
    if(message) {
        erased.message = (context, cards, chooser) => message(context, (Array.isArray(cards) ? cards : [cards]).map(holds), chooser);
    }
    if(subActionProperties) {
        erased.subActionProperties = (cards) => subActionProperties(chosen(cards));
    }
    return erased;
}

export class SelectCardAction<C extends AbilityContext = AbilityContext> extends CardGameAction<
    SelectCardActionProperties<C>,
    EventName,
    C,
    'cardCondition' | 'subActionProperties' | 'targets' | 'hidePromptIfSingleCard' | 'manuallyRaiseEvent'
> {
    defaultProperties = {
        cardCondition: () => true,
        subActionProperties: (card: BaseCard | BaseCard[]) => ({ target: card }),
        targets: false,
        hidePromptIfSingleCard: false,
        manuallyRaiseEvent: false
    };

    /** A custom `chatText` brings its own arguments, from `{0}` on. */
    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { chatText, chatTextArgs } = this.getProperties(context);
        if(chatText) {
            return [chatText, (chatTextArgs && chatTextArgs(context)) || []];
        }
        return super.getEffectMessage(context, additionalProperties);
    }

    protected effectMessage(): MessageArgs {
        return ['choose a target for {0}', []];
    }

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        const { cardCondition, subActionProperties } = properties;
        let selector = properties.selector;
        if(!selector) {
            // the selector is built for this context and only used with it
            const selectorCardCondition = (card: BaseCard) =>
                properties.gameAction.allTargetsLegal(
                    context,
                    Object.assign({}, additionalProperties, subActionProperties(card))
                ) && cardCondition(card, context);
            selector = CardSelector.for(Object.assign({}, properties, { cardCondition: selectorCardCondition }));
        }
        return Object.assign(properties, { selector });
    }

    canAffect(card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const player = resolveChoosingPlayer(context, properties.player, properties.targets);
        return !!player && properties.selector.canTarget(card, context, player);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const player = resolveChoosingPlayer(context, properties.player, properties.targets);
        return !!player && properties.selector.hasEnoughTargets(context, player);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const player = resolveChoosingPlayer(context, properties.player, properties.targets);
        if(!player) {
            return;
        }
        let mustSelect: BaseCard[] = [];
        if(properties.targets) {
            mustSelect = properties.selector
                .getAllLegalTargets(context, player)
                .filter((card: BaseCard) =>
                    card
                        .getEffects(EffectName.MustBeChosen)
                        .some((restriction) => restriction.isMatch(RestrictionType.Target, context))
                );
        }
        if(!properties.selector.hasEnoughTargets(context, player)) {
            return;
        }
        const promptProperties = {
            context,
            activePromptTitle: properties.activePromptTitle,
            gameAction: properties.gameAction,
            selector: properties.selector,
            mustSelect: mustSelect,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (player: Player, cards: BaseCard | BaseCard[]) => {
                const text = properties.message?.(context, cards, player);
                if(text) {
                    context.game.addMessage(text);
                }
                properties.gameAction.addEventsToArray(
                    events,
                    context,
                    Object.assign({ parentAction: this }, additionalProperties, properties.subActionProperties(cards))
                );
                if(properties.manuallyRaiseEvent) {
                    context.game.openEventWindow(events);
                }
                return true;
            }
        };
        if(properties.hidePromptIfSingleCard) {
            const cards = properties.selector.getAllLegalTargets(context);
            if(cards.length === 1) {
                promptProperties.onSelect(player, cards[0]);
                return;
            }
        }
        context.game.promptForSelect(player, promptProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.targets && properties.player !== Players.Opponent;
    }
}
