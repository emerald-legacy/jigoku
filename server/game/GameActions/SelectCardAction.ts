import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import CardSelector from '../CardSelector.js';
import type BaseCardSelector from '../CardSelectors/BaseCardSelector.js';
import { CardType, EffectName, Location, Players, TargetMode } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { GameAction } from './GameAction.js';
import type { EffectArg } from '../Interfaces.js';

export interface SelectCardProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    cardType?: CardType | CardType[];
    controller?: Players;
    location?: Location | Location[];
    cardCondition?: (card: any, context: AbilityContext) => boolean;
    targets?: boolean;
    message?: string;
    manuallyRaiseEvent?: boolean;
    messageArgs?: (card: any, player: Player, properties: SelectCardProperties) => unknown[];
    gameAction: GameAction;
    selector?: BaseCardSelector;
    mode?: TargetMode;
    numCards?: number;
    hidePromptIfSingleCard?: boolean;
    subActionProperties?: (card: any) => Record<string, unknown>;
    cancelHandler?: () => void;
    effect?: string;
    effectArgs?: (context: AbilityContext) => EffectArg[];
}

type ResolvedSelectCardProperties = SelectCardProperties & {
    cardCondition: NonNullable<SelectCardProperties['cardCondition']>;
    subActionProperties: NonNullable<SelectCardProperties['subActionProperties']>;
    selector: BaseCardSelector;
};

export class SelectCardAction extends CardGameAction {
    defaultProperties: SelectCardProperties = {
        cardCondition: () => true,
        gameAction: null as unknown as GameAction,
        subActionProperties: (card) => ({ target: card }),
        targets: false,
        hidePromptIfSingleCard: false,
        manuallyRaiseEvent: false
    };

    constructor(properties: SelectCardProperties | ((context: AbilityContext) => SelectCardProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let { target, effect, effectArgs } = this.getProperties(context) as SelectCardProperties;
        if(effect) {
            return [effect, (effectArgs && effectArgs(context)) || []];
        }
        return ['choose a target for {0}', [target]];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ResolvedSelectCardProperties {
        let properties = super.getProperties(context, additionalProperties) as SelectCardProperties;
        properties.gameAction.setDefaultTarget(() => properties.target);
        const cardCondition = properties.cardCondition ?? (() => true);
        const subActionProperties = properties.subActionProperties ?? ((card: BaseCard) => ({ target: card }));
        let selector = properties.selector;
        if(!selector) {
            const selectorCardCondition = (card: BaseCard, context: AbilityContext) =>
                properties.gameAction.allTargetsLegal(
                    context,
                    Object.assign({}, additionalProperties, subActionProperties(card))
                ) && cardCondition(card, context);
            selector = CardSelector.for(Object.assign({}, properties, { cardCondition: selectorCardCondition }));
        }
        return Object.assign(properties, { cardCondition, subActionProperties, selector });
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const player =
            (properties.targets && context.choosingPlayerOverride) ||
            (properties.player === Players.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.canTarget(card, context, player);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const player =
            (properties.targets && context.choosingPlayerOverride) ||
            (properties.player === Players.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.hasEnoughTargets(context, player);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player: Player = (properties.player === Players.Opponent ? context.player.opponent : context.player) as Player;
        let mustSelect: BaseCard[] = [];
        if(properties.targets) {
            player = (context.choosingPlayerOverride as Player) || player;
            mustSelect = properties.selector
                .getAllLegalTargets(context, player)
                .filter((card: BaseCard) =>
                    card
                        .getEffects(EffectName.MustBeChosen)
                        .some((restriction: { isMatch: (kind: string, context: AbilityContext) => boolean }) => restriction.isMatch('target', context))
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
        const finalProperties = Object.assign(defaultProperties, properties);
        if(properties.hidePromptIfSingleCard) {
            const cards = properties.selector.getAllLegalTargets(context);
            if(cards.length === 1) {
                finalProperties.onSelect(player, cards[0]);
                return;
            }
        }
        context.game.promptForSelect(player, finalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return !!properties.targets && properties.player !== Players.Opponent;
    }
}
