import { AbilityContext } from '../AbilityContext.js';
import { Event } from '../Events/Event.js';
import CardSelector, { type CardSelectorProperties, defaultMode, isMultiCardMode, type MultiCardMode, type SingleCardMode } from '../CardSelector.js';
import EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type BaseCard from '../BaseCard.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type BaseCardSelector from '../CardSelectors/BaseCardSelector.js';
import { isCardOfType, isCardTypeList, type CardOfType, type CardTypes } from '../types/CardOfType.js';

interface PromptButton {
    text: string;
    arg: string;
}

interface PromptOptions {
    source?: EffectSource | string;
    context?: AbilityContext;
    buttons?: PromptButton[];
    controls?: Array<{ type: string; source: unknown; targets: unknown[] }>;
    selectCard?: boolean;
    ordered?: boolean;
    hideIfNoLegalTargets?: boolean;
    activePromptTitle?: string;
    waitingPromptTitle?: string;
    mustSelect?: BaseCard[];
    gameAction?: GameAction | GameAction[];
    onMenuCommand?: (player: Player, arg: string) => boolean | void;
    onCancel?: (player: Player) => boolean | void;
}

type SelectorOptions = Omit<CardSelectorProperties, 'cardType' | 'cardCondition' | 'mode' | 'numCards' | 'multiSelect' | 'maxStat' | 'optional'>;

interface CardChoice<K extends CardTypes> extends PromptOptions, SelectorOptions {
    selector?: undefined;
    cardType?: K;
    cardCondition?: (card: CardOfType<K>, context: AbilityContext) => boolean;
    onCardToggle?: (player: Player, card: CardOfType<K>) => void;
}

/** One card, passed on its own. */
export interface SingleCardChoice<K extends CardTypes> extends CardChoice<K> {
    mode?: SingleCardMode;
    numCards?: 1;
    multiSelect?: false;
    maxStat?: undefined;
    optional?: false;
    onSelect?: (player: Player, card: CardOfType<K>) => boolean | void;
}

/** Skipping it passes `[]`. */
export interface OptionalCardChoice<K extends CardTypes> extends Omit<SingleCardChoice<K>, 'optional' | 'onSelect'> {
    optional: true;
    onSelect?: (player: Player, card: CardOfType<K> | []) => boolean | void;
}

export interface CardsChoice<K extends CardTypes> extends CardChoice<K> {
    mode: MultiCardMode;
    numCards?: number;
    multiSelect?: boolean;
    maxStat?: () => number;
    optional?: boolean;
    onSelect?: (player: Player, cards: CardOfType<K>[]) => boolean | void;
}

/** A selector built by the caller decides what is passed. */
export interface SelectorChoice extends PromptOptions {
    selector: BaseCardSelector;
    onSelect?: (player: Player, cards: BaseCard | BaseCard[]) => boolean | void;
    onCardToggle?: (player: Player, card: BaseCard) => void;
}

export type SelectCardPromptProperties<K extends CardTypes = CardTypes> =
    SingleCardChoice<K> | OptionalCardChoice<K> | CardsChoice<K> | SelectorChoice;

interface ErasedProperties extends PromptOptions, CardSelectorProperties {
    selector?: BaseCardSelector;
    onSelect?: (player: Player, cards: BaseCard | BaseCard[]) => boolean | void;
    onCardToggle?: (player: Player, card: BaseCard) => void;
}

function isCardsChoice<K extends CardTypes>(properties: SingleCardChoice<K> | OptionalCardChoice<K> | CardsChoice<K>): properties is CardsChoice<K> {
    return isMultiCardMode(properties.mode ?? defaultMode(properties));
}

/** The selector only offers cards of the declared types, so the checks never reject one. */
function erase<K extends CardTypes>(properties: SelectCardPromptProperties<K>): ErasedProperties {
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

/**
 * General purpose prompt that asks the user to select 1 or more cards.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards the player
 *                      must select. Set to 0 if there is no limit on the num
 *                      of cards that can be selected.
 * multiSelect        - boolean that ensures that the selected cards are sent as
 *                      an array, even if the numCards limit is 1.
 * buttons            - array of buttons for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * maxStat            - a function that returns the maximum value that cards
 *                      selected by the prompt cannot exceed. If not specified,
 *                      then no stat limiting is done on the prompt.
 * cardStat           - a function that takes a card and returns a stat value.
 *                      Used for prompts that have a maximum stat value.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
 * cardType           - a string or array of strings listing which types of
 *                      cards can be selected. Defaults to the list of draw
 *                      card types.
 * onSelect           - a callback that is called once all cards have been
 *                      selected. On single card prompts this is called as soon
 *                      as an elligible card is clicked. On multi-select prompts
 *                      it is called when the done button is clicked. If the
 *                      callback does not return true, the prompt is not marked
 *                      as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any cards.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * gameAction         - a GameAction object representing the game action to be checked on
 *                      target cards.
 * ordered            - an optional boolean indicating whether or not to display
 *                      the order of the selection during the prompt.
 * mustSelect         - an array of cards which must be selected
 */
class SelectCardPrompt<K extends CardTypes = CardTypes> extends UiPrompt {
    choosingPlayer: Player;
    properties: ErasedProperties;
    context: AbilityContext;
    hideIfNoLegalTargets: boolean;
    selector: BaseCardSelector;
    selectedCards: BaseCard[];
    onlyMustSelectMayBeChosen: boolean;
    cannotUnselectMustSelect: boolean;
    targets: BaseCard[];

    constructor(game: Game, choosingPlayer: Player, typedProperties: SelectCardPromptProperties<K>) {
        super(game);
        const properties = erase(typedProperties);

        this.choosingPlayer = choosingPlayer;
        if(typeof properties.source === 'string') {
            properties.source = new EffectSource(game, properties.source);
        } else if(properties.context && properties.context.source) {
            properties.source = properties.context.source;
        }
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }
        if(!properties.source) {
            properties.source = new EffectSource(game);
        }

        this.properties = properties;
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: properties.source });
        properties.buttons ??= [];
        properties.controls ??= this.getDefaultControls();
        properties.selectCard ??= true;
        properties.cardCondition ??= () => true;
        properties.onSelect ??= () => true;
        properties.onMenuCommand ??= () => true;
        properties.onCancel ??= () => true;
        properties.hideIfNoLegalTargets ??= false;
        if(properties.gameAction) {
            const gameActions = Array.isArray(properties.gameAction) ? properties.gameAction : [properties.gameAction];
            this.properties.gameAction = gameActions;
            const cardCondition = this.properties.cardCondition ?? (() => true);
            this.properties.cardCondition = (card: BaseCard, context: AbilityContext) =>
                cardCondition(card, context) && gameActions.some((gameAction: GameAction) => gameAction.canAffect(card, context));
        }
        this.hideIfNoLegalTargets = properties.hideIfNoLegalTargets ?? false;
        this.selector = properties.selector || CardSelector.for(this.properties);
        this.selectedCards = [];
        this.onlyMustSelectMayBeChosen = false;
        this.cannotUnselectMustSelect = false;
        this.targets = [];
        if(properties.mustSelect) {
            const numCards = this.selector.numCards ?? 0;
            if(this.selector.hasEnoughSelected(properties.mustSelect, properties.context) && numCards > 0 && properties.mustSelect.length >= numCards) {
                this.onlyMustSelectMayBeChosen = true;
            } else {
                this.selectedCards = [...properties.mustSelect];
                this.cannotUnselectMustSelect = true;
            }
        }
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.setSelectedCards(this.selectedCards);
    }

    getDefaultControls(): Array<{ type: string; source: unknown; targets: unknown[] }> {
        const rawTargets: Array<BaseCard | BaseCard[]> = this.context.targets ? Object.values(this.context.targets) : [];
        const targets = rawTargets.reduce((array: BaseCard[], target: BaseCard | BaseCard[]) => array.concat(target), []);
        const eventCard = Event.promptCardOf('event' in this.context ? this.context.event : undefined);
        if(targets.length === 0 && eventCard) {
            this.targets = [eventCard];
        }
        return [{
            type: 'targeting',
            source: this.context.source.getShortSummary(),
            targets: targets.map((target: BaseCard) => target.getShortSummaryForControls(this.choosingPlayer))
        }];
    }

    continue(): boolean {
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

    activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = this.properties.buttons ?? [];
        if(!this.selector.automaticFireOnSelect(this.context) && this.selector.hasEnoughSelected(this.selectedCards, this.context) || this.selector.optional) {
            if(buttons.every((button: PromptButton) => button.arg !== 'done')) {
                buttons = [{ text: 'Done', arg: 'done' }].concat(buttons);
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
            promptTitle: typeof this.properties.source === 'string' ? undefined : this.properties.source?.name,
            controls: this.properties.controls
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player: Player, card: BaseCard): boolean {
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
            this.selectedCards = this.selectedCards.filter(c => c !== card);
        }
        this.choosingPlayer.setSelectedCards(this.selectedCards);

        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }

        return true;
    }

    fireOnSelect(): boolean {
        const cardParam = this.selector.formatSelectParam(this.selectedCards);
        if((this.properties.onSelect ?? (() => true))(this.choosingPlayer, cardParam)) {
            this.complete();
            return true;
        }
        this.clearSelection();
        return false;
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'cancel') {
            (this.properties.onCancel ?? (() => true))(player);
            this.complete();
            return true;
        } else if(arg === 'done' && this.selector.hasEnoughSelected(this.selectedCards, this.context)) {
            return this.fireOnSelect();
        } else if((this.properties.onMenuCommand ?? (() => true))(player, arg)) {
            this.complete();
            return true;
        }
        return false;
    }

    complete(): void {
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

export default SelectCardPrompt;
