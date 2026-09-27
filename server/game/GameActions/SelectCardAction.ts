import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import CardSelector from '../CardSelector.js';
import type BaseCardSelector from '../CardSelectors/BaseCardSelector.js';
import { CardType, EffectName, Location, Players, TargetMode, type EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { GameAction, WithDefaults } from './GameAction.js';
import type { EffectArg } from '../Interfaces.js';
import { isCardOfType, type CardOfType } from '../types/CardOfType.js';

type CardTypes = CardType | readonly CardType[] | undefined;

const isCardTypeList = (cardType: CardTypes): cardType is readonly CardType[] => Array.isArray(cardType);

/** `K` is the declared `cardType`, which fixes the class of card `cardCondition` receives. */
export interface SelectCardProperties<C extends AbilityContext = AbilityContext, K extends CardTypes = CardTypes> extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    cardType?: K;
    controller?: Players;
    location?: Location | Location[];
    cardCondition?(card: CardOfType<K>, context: C): boolean;
    targets?: boolean;
    message?: string;
    manuallyRaiseEvent?: boolean;
    messageArgs?(card: BaseCard | BaseCard[], player: Player, properties: SelectCardProperties<C, K>): MsgArg[];
    gameAction: GameAction;
    selector?: BaseCardSelector;
    mode?: TargetMode;
    numCards?: number;
    hidePromptIfSingleCard?: boolean;
    subActionProperties?(card: BaseCard | BaseCard[]): Record<string, unknown>;
    cancelHandler?: () => void;
    effect?: string;
    effectArgs?: (context: C) => EffectArg[];
}

export class SelectCardAction<C extends AbilityContext = AbilityContext, K extends CardTypes = CardTypes> extends CardGameAction<SelectCardProperties<C, K>, EventName, C> {
    defaultProperties: Partial<SelectCardProperties<C, K>> = {
        cardCondition: () => true,
        subActionProperties: (card) => ({ target: card }),
        targets: false,
        hidePromptIfSingleCard: false,
        manuallyRaiseEvent: false
    };

    constructor(properties: SelectCardProperties<C, K> | ((context: C) => SelectCardProperties<C, K>)) {
        super(properties);
    }

    getEffectMessage(context: C): MessageArgs {
        let { target, effect, effectArgs } = this.getProperties(context);
        if(effect) {
            return [effect, (effectArgs && effectArgs(context)) || []];
        }
        return ['choose a target for {0}', [target]];
    }

    getProperties(context: C, additionalProperties = {}): WithDefaults<SelectCardProperties<C, K>, 'cardCondition' | 'subActionProperties' | 'selector'> {
        let properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        const cardCondition = properties.cardCondition ?? (() => true);
        const subActionProperties = properties.subActionProperties ?? ((card: BaseCard | BaseCard[]) => ({ target: card }));
        // the selector only offers cards of the declared types, so this check never rejects one
        const isCardOfDeclaredType = isCardOfType(properties.cardType);
        let selector = properties.selector;
        if(!selector) {
            const selectorCardCondition = (card: BaseCard, context: C) =>
                properties.gameAction.allTargetsLegal(
                    context,
                    Object.assign({}, additionalProperties, subActionProperties(card))
                ) && isCardOfDeclaredType(card) && cardCondition(card, context);
            const cardType: CardTypes = properties.cardType;
            selector = CardSelector.for(Object.assign({}, properties, {
                ...(cardType !== undefined ? { cardType: isCardTypeList(cardType) ? [...cardType] : cardType } : {}),
                cardCondition: selectorCardCondition
            }));
        }
        return Object.assign(properties, { cardCondition, subActionProperties, selector });
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
                        .some((restriction: { isMatch: (kind: string, context: C) => boolean }) => restriction.isMatch('target', context))
                );
        }
        if(!properties.selector.hasEnoughTargets(context, player)) {
            return;
        }
        const messageArgs = properties.messageArgs;
        const defaultProperties = {
            context: context,
            selector: properties.selector,
            mustSelect: mustSelect,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (player: Player, cards: BaseCard | BaseCard[]) => {
                if(properties.message && messageArgs) {
                    context.game.addMessage(properties.message, ...messageArgs(cards, player, properties));
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
        let properties = this.getProperties(context, additionalProperties);
        return !!properties.targets && properties.player !== Players.Opponent;
    }
}
