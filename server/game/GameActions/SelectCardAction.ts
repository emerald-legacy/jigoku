import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import CardSelector, { type SingleCardMode } from '../CardSelector.js';
import type BaseCardSelector from '../CardSelectors/BaseCardSelector.js';
import { CardType, EffectName, Location, Players, TargetMode, type EventName } from '../Constants.js';
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
    message?: string;
    manuallyRaiseEvent?: boolean;
    gameAction: GameAction;
    selector?: BaseCardSelector;
    hidePromptIfSingleCard?: boolean;
    cancelHandler?: () => void;
    effect?: string;
    effectArgs?: (context: C) => EffectArg[];
}

/** One card. An optional select that is skipped resolves with no target and no message. */
export interface SelectCardProperties<C extends AbilityContext = AbilityContext, K extends CardTypes = CardTypes> extends SelectCardBase<C, K> {
    mode?: SingleCardMode;
    numCards?: 1;
    messageArgs?: (card: CardOfType<K>, player: Player, properties: SelectCardActionProperties<C>) => MsgArg[];
    subActionProperties?: (card: CardOfType<K>) => Record<string, unknown>;
}

/** `subActionProperties` gets one candidate at a time while it checks, and what was chosen once it resolves. Any mode is sound. */
export interface SelectCardsProperties<C extends AbilityContext = AbilityContext, K extends CardTypes = CardTypes> extends SelectCardBase<C, K> {
    mode?: TargetMode;
    numCards?: number;
    messageArgs?: (cards: CardOfType<K>[], player: Player, properties: SelectCardActionProperties<C>) => MsgArg[];
    subActionProperties?: (cards: CardOfType<K> | CardOfType<K>[]) => Record<string, unknown>;
}

/**
 * What the action works with: the card type is checked once, in `cardCondition`.
 * Callbacks taking the context use method syntax, so an action for a narrower context stays assignable.
 */
export interface SelectCardActionProperties<C extends AbilityContext = AbilityContext> extends Omit<SelectCardBase<C, CardTypes>, 'cardType' | 'cardCondition' | 'effectArgs'> {
    cardType?: CardType | CardType[];
    cardCondition?(card: BaseCard, context: C): boolean;
    effectArgs?(context: C): EffectArg[];
    mode?: TargetMode;
    numCards?: number;
    /** Gets the resolved properties; nothing means no message. */
    messageArgs?: (cards: BaseCard | BaseCard[], player: Player, properties: SelectCardActionProperties<C>) => MsgArg[] | undefined;
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
    const { messageArgs, subActionProperties, ...base } = properties;
    const { erased, holds } = eraseBase(base);
    // a skipped optional select passes []
    if(messageArgs) {
        erased.messageArgs = (card, player, resolved) => Array.isArray(card) ? undefined : messageArgs(holds(card), player, resolved);
    }
    if(subActionProperties) {
        erased.subActionProperties = (card) => Array.isArray(card) ? { target: [] } : subActionProperties(holds(card));
    }
    return erased;
}

export function eraseSelectCardsProperties<C extends AbilityContext, K extends CardTypes>(properties: SelectCardsProperties<C, K>): SelectCardActionProperties<C> {
    const { messageArgs, subActionProperties, ...base } = properties;
    const { erased, holds } = eraseBase(base);
    const chosen = (cards: BaseCard | BaseCard[]) => Array.isArray(cards) ? cards.map(holds) : holds(cards);
    if(messageArgs) {
        erased.messageArgs = (cards, player, resolved) => messageArgs((Array.isArray(cards) ? cards : [cards]).map(holds), player, resolved);
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

    /** A custom `effect` brings its own arguments, from `{0}` on. */
    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        const { effect, effectArgs } = this.getProperties(context);
        if(effect) {
            return [effect, (effectArgs && effectArgs(context)) || []];
        }
        return super.getEffectMessage(context, additionalProperties);
    }

    protected effectMessage(): MessageArgs {
        return ['choose a target for {0}', []];
    }

    getProperties(context: C, additionalProperties = {}) {
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

    canAffect(card: BaseCard, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const player =
            (properties.targets && context.choosingPlayerOverride) ||
            (properties.player === Players.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.canTarget(card, context, player);
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const player =
            (properties.targets && context.choosingPlayerOverride) ||
            (properties.player === Players.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.hasEnoughTargets(context, player);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        const opponent = context.player.opponent;
        let player: Player = properties.player === Players.Opponent && opponent ? opponent : context.player;
        let mustSelect: BaseCard[] = [];
        if(properties.targets) {
            player = context.choosingPlayerOverride || player;
            mustSelect = properties.selector
                .getAllLegalTargets(context, player)
                .filter((card: BaseCard) =>
                    card
                        .getEffects(EffectName.MustBeChosen)
                        .some((restriction) => restriction.isMatch('target', context))
                );
        }
        if(!properties.selector.hasEnoughTargets(context, player)) {
            return;
        }
        const { messageArgs } = properties;
        const defaultProperties = {
            context: context,
            selector: properties.selector,
            mustSelect: mustSelect,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (player: Player, cards: BaseCard | BaseCard[]) => {
                const args = messageArgs?.(cards, player, properties);
                if(properties.message && args) {
                    context.game.addMessage(properties.message, ...args);
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
        const finalProperties = { ...defaultProperties, ...properties };
        if(properties.hidePromptIfSingleCard) {
            const cards = properties.selector.getAllLegalTargets(context);
            if(cards.length === 1) {
                finalProperties.onSelect(player, cards[0]);
                return;
            }
        }
        context.game.promptForSelect(player, finalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.targets && properties.player !== Players.Opponent;
    }
}
