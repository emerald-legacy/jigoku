import { AbilityContext } from '../AbilityContext.js';
import { CardSelector, type CardSelectorProperties, defaultMode, isMultiCardMode, type MultiCardMode, type SingleCardMode } from '../CardSelector.js';
import type { EffectSource } from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import { resolvePromptSource } from './PromptSource.js';
import { targetingControl, targetsOrEventCard } from './targetingControl.js';
import type { PromptButton, PromptControl } from '../PlayerPromptState.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type BaseCard from '../BaseCard.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { BaseCardSelector } from '../CardSelectors/BaseCardSelector.js';
import { isCardOfType, isCardTypeList, type CardOfType, type CardTypes } from '../types/CardOfType.js';

interface PromptOptions {
    /** Where the prompt comes from, usually a card; it gives the default waiting title. */
    source?: EffectSource | string;
    context?: AbilityContext;
    buttons?: PromptButton[];
    controls?: PromptControl[];
    selectCard?: boolean;
    /** Shows the order of the selection. */
    ordered?: boolean;
    hideIfNoLegalTargets?: boolean;
    activePromptTitle?: string;
    waitingPromptTitle?: string;
    /** Cards that must be among those selected. */
    mustSelect?: BaseCard[];
    /** Only cards one of these can affect may be selected. */
    gameAction?: GameAction | GameAction[];
    /** One of the extra `buttons` was clicked. */
    onMenuCommand?: (player: Player, arg: string) => boolean | void;
    /** Done was clicked with nothing selected. */
    onCancel?: (player: Player) => boolean | void;
}

type SelectorOptions = Omit<CardSelectorProperties, 'cardType' | 'cardCondition' | 'mode' | 'numCards' | 'multiSelect' | 'maxStat' | 'optional'>;

interface CardChoice<Types extends CardTypes> extends PromptOptions, SelectorOptions {
    selector?: undefined;
    cardType?: Types;
    cardCondition?: (card: CardOfType<Types>, context: AbilityContext) => boolean;
    onCardToggle?: (player: Player, card: CardOfType<Types>) => void;
}

/**
 * One card, passed on its own: `onSelect` runs as soon as a legal card is clicked (for several cards, on Done).
 * The prompt is complete only when `onSelect` returns true.
 */
export interface SingleCardChoice<Types extends CardTypes> extends CardChoice<Types> {
    mode?: SingleCardMode;
    numCards?: 1;
    multiSelect?: false;
    maxStat?: undefined;
    optional?: false;
    onSelect?: (player: Player, card: CardOfType<Types>) => boolean | void;
}

/** Skipping it passes `[]`. */
export interface OptionalCardChoice<Types extends CardTypes> extends Omit<SingleCardChoice<Types>, 'optional' | 'onSelect'> {
    optional: true;
    onSelect?: (player: Player, card: CardOfType<Types> | []) => boolean | void;
}

export interface CardsChoice<Types extends CardTypes> extends CardChoice<Types> {
    mode: MultiCardMode;
    numCards?: number;
    multiSelect?: boolean;
    maxStat?: () => number;
    optional?: boolean;
    onSelect?: (player: Player, cards: CardOfType<Types>[]) => boolean | void;
}

/** A selector built by the caller decides what is passed. */
export interface SelectorChoice extends PromptOptions {
    selector: BaseCardSelector;
    onSelect?: (player: Player, cards: BaseCard | BaseCard[]) => boolean | void;
    onCardToggle?: (player: Player, card: BaseCard) => void;
}

export type SelectCardPromptProperties<Types extends CardTypes = CardTypes> =
    SingleCardChoice<Types> | OptionalCardChoice<Types> | CardsChoice<Types> | SelectorChoice;

interface ErasedProperties extends PromptOptions, CardSelectorProperties {
    selector?: BaseCardSelector;
    onSelect?: (player: Player, cards: BaseCard | BaseCard[]) => boolean | void;
    onCardToggle?: (player: Player, card: BaseCard) => void;
}

type DefaultedProperties = 'buttons' | 'controls' | 'selectCard' | 'cardCondition' | 'onSelect' | 'onMenuCommand' | 'onCancel' | 'hideIfNoLegalTargets';

type ResolvedProperties = ErasedProperties & Required<Pick<ErasedProperties, DefaultedProperties>> & { source: EffectSource };

function isCardsChoice<Types extends CardTypes>(properties: SingleCardChoice<Types> | OptionalCardChoice<Types> | CardsChoice<Types>): properties is CardsChoice<Types> {
    return isMultiCardMode(properties.mode ?? defaultMode(properties));
}

/** The selector only offers cards of the declared types, so the checks never reject one. */
function erase<Types extends CardTypes>(properties: SelectCardPromptProperties<Types>): ErasedProperties {
    if(properties.selector) {
        return properties;
    }
    const isCard = isCardOfType(properties.cardType);
    const holds = (card: BaseCard) => {
        if(!isCard(card)) {
            throw new Error(`${card.name} is not a card this prompt can select`);
        }
        return card;
    };
    const { cardType, cardCondition, onCardToggle, onSelect: _onSelect, ...rest } = properties;
    const erased: ErasedProperties = rest;
    if(cardType !== undefined) {
        erased.cardType = isCardTypeList(cardType) ? [...cardType] : cardType;
    }
    if(cardCondition) {
        erased.cardCondition = (card, context) => isCard(card) && cardCondition(card, context);
    }
    if(onCardToggle) {
        erased.onCardToggle = (player, card) => onCardToggle(player, holds(card));
    }
    if(isCardsChoice(properties)) {
        const { onSelect } = properties;
        if(onSelect) {
            erased.onSelect = (player, cards) => onSelect(player, (Array.isArray(cards) ? cards : [cards]).map(holds));
        }
    } else if(properties.optional) {
        const { onSelect } = properties;
        if(onSelect) {
            erased.onSelect = (player, card) => onSelect(player, Array.isArray(card) && card.length === 0 ? [] : holds(single(card)));
        }
    } else {
        const { onSelect } = properties;
        if(onSelect) {
            erased.onSelect = (player, card) => onSelect(player, holds(single(card)));
        }
    }
    return erased;
}

function single(selected: BaseCard | BaseCard[]): BaseCard {
    if(Array.isArray(selected)) {
        throw new Error('a single-card prompt selected several cards');
    }
    return selected;
}

/** Asks a player to select one or more cards; what may be chosen and what happens is in `SelectCardPromptProperties`. */
export class SelectCardPrompt<Types extends CardTypes = CardTypes> extends UiPrompt {
    choosingPlayer: Player;
    properties: ResolvedProperties;
    context: AbilityContext;
    hideIfNoLegalTargets: boolean;
    selector: BaseCardSelector;
    selectedCards: BaseCard[];
    onlyMustSelectMayBeChosen: boolean;
    cannotUnselectMustSelect: boolean;

    constructor(game: Game, choosingPlayer: Player, typedProperties: SelectCardPromptProperties<Types>) {
        super(game);
        const properties = erase(typedProperties);

        this.choosingPlayer = choosingPlayer;
        const { source, waitingPromptTitle } = resolvePromptSource(game, properties);
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: source });
        this.properties = {
            ...properties,
            source,
            waitingPromptTitle,
            buttons: properties.buttons ?? [],
            controls: properties.controls ?? this.getDefaultControls(),
            selectCard: properties.selectCard ?? true,
            cardCondition: properties.cardCondition ?? (() => true),
            onSelect: properties.onSelect ?? (() => true),
            onMenuCommand: properties.onMenuCommand ?? (() => true),
            onCancel: properties.onCancel ?? (() => true),
            hideIfNoLegalTargets: properties.hideIfNoLegalTargets ?? false
        };
        if(properties.gameAction) {
            const gameActions = Array.isArray(properties.gameAction) ? properties.gameAction : [properties.gameAction];
            this.properties.gameAction = gameActions;
            const cardCondition = this.properties.cardCondition;
            this.properties.cardCondition = (card: BaseCard, context: AbilityContext) =>
                cardCondition(card, context) && gameActions.some((gameAction: GameAction) => gameAction.canAffect(card, context));
        }
        this.hideIfNoLegalTargets = this.properties.hideIfNoLegalTargets;
        this.selector = properties.selector || CardSelector.for(this.properties);
        this.selectedCards = [];
        this.onlyMustSelectMayBeChosen = false;
        this.cannotUnselectMustSelect = false;
        if(properties.mustSelect) {
            if(properties.mustSelect.length > 0 && this.selector.hasReachedLimit(properties.mustSelect, this.context)) {
                this.onlyMustSelectMayBeChosen = true;
            } else {
                this.selectedCards = [...properties.mustSelect];
                this.cannotUnselectMustSelect = true;
            }
        }
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.setSelectedCards(this.selectedCards);
    }

    getDefaultControls(): PromptControl[] {
        const rawTargets: Array<BaseCard | BaseCard[]> = this.context.targets ? Object.values(this.context.targets) : [];
        const targets = rawTargets.reduce((array: BaseCard[], target: BaseCard | BaseCard[]) => array.concat(target), []);
        return [targetingControl(this.context.source, targetsOrEventCard(this.context, targets), this.choosingPlayer)];
    }

    override continue(): boolean {
        if(this.hideIfNoLegalTargets && this.selector.optional && !this.selector.hasEnoughTargets(this.context, this.choosingPlayer)) {
            this.complete();
        }

        if(!this.isComplete()) {
            this.highlightSelectableCards();
            this.choosingPlayer.setSelectedCards(this.selectedCards);
        }

        return super.continue();
    }

    highlightSelectableCards(): void {
        this.choosingPlayer.setSelectableCards(this.selector.findPossibleCards(this.context).filter((card: BaseCard) => this.checkCardCondition(card)));
    }

    override activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    override activePrompt() {
        let buttons = this.properties.buttons;
        if(!this.selector.automaticFireOnSelect(this.context) && this.selector.hasEnoughSelected(this.selectedCards, this.context) || this.selector.optional) {
            if(buttons.every((button: PromptButton) => button.arg !== 'done')) {
                buttons = [{ text: 'Done', arg: 'done' }, ...buttons];
            }
        }
        if(this.game.manualMode && buttons.every((button: PromptButton) => button.arg !== 'cancel')) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            selectCard: this.properties.selectCard,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.selector.defaultActivePromptTitle(this.context),
            buttons: buttons,
            promptTitle: this.properties.source.name,
            controls: this.properties.controls
        };
    }

    override waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    override onCardClicked(player: Player, card: BaseCard): boolean {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        if(!this.selectCard(card)) {
            return false;
        }

        if(this.selector.automaticFireOnSelect(this.context) && this.selector.hasReachedLimit(this.selectedCards, this.context)) {
            this.fireOnSelect();
        }

        return true;
    }

    checkCardCondition(card: BaseCard): boolean {
        if(this.onlyMustSelectMayBeChosen && !this.properties.mustSelect?.includes(card)) {
            return false;
        } else if(this.selectedCards.includes(card)) {
            return true;
        }

        return (
            this.selector.canTarget(card, this.context, this.choosingPlayer, this.selectedCards) &&
            !this.selector.wouldExceedLimit(this.selectedCards, card)
        );
    }

    selectCard(card: BaseCard): boolean {
        if(this.selector.hasReachedLimit(this.selectedCards, this.context) && !this.selectedCards.includes(card)) {
            return false;
        } else if(this.cannotUnselectMustSelect && this.properties.mustSelect?.includes(card)) {
            return false;
        }

        if(!this.selectedCards.includes(card)) {
            this.selectedCards.push(card);
        } else {
            this.selectedCards = this.selectedCards.filter((c) => c !== card);
        }
        this.choosingPlayer.setSelectedCards(this.selectedCards);

        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }

        return true;
    }

    fireOnSelect(): boolean {
        const cardParam = this.selector.formatSelectParam(this.selectedCards);
        if(this.properties.onSelect(this.choosingPlayer, cardParam)) {
            this.complete();
            return true;
        }
        this.clearSelection();
        return false;
    }

    override menuCommand(player: Player, arg: string): boolean {
        if(arg === 'cancel') {
            this.properties.onCancel(player);
            this.complete();
            return true;
        } else if(arg === 'done' && this.selector.hasEnoughSelected(this.selectedCards, this.context)) {
            return this.fireOnSelect();
        } else if(this.properties.onMenuCommand(player, arg)) {
            this.complete();
            return true;
        }
        return false;
    }

    override complete(): void {
        this.clearSelection();
        return super.complete();
    }

    clearSelection(): void {
        this.selectedCards = [];
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();
        this.choosingPlayer.clearSelectableRings();
    }
}

