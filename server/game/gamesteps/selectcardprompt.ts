import { AbilityContext } from '../AbilityContext.js';
import CardSelector from '../CardSelector.js';
import EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';

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
class SelectCardPrompt extends UiPrompt {
    choosingPlayer: Player;
    properties: any;
    context: any;
    hideIfNoLegalTargets: boolean;
    selector: any;
    selectedCards: any[];
    previouslySelectedCards: any[];
    onlyMustSelectMayBeChosen: boolean;
    cannotUnselectMustSelect: boolean;
    targets: any[];

    constructor(game: any, choosingPlayer: Player, properties: any) {
        super(game);

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
        // Apply defaults for missing properties
        const defaults = this.defaultProperties();
        for(const key in defaults) {
            if(this.properties[key] === undefined) {
                this.properties[key] = defaults[key];
            }
        }
        if(properties.gameAction) {
            if(!Array.isArray(properties.gameAction)) {
                this.properties.gameAction = [properties.gameAction];
            }
            let cardCondition = this.properties.cardCondition;
            this.properties.cardCondition = (card: any, context: any) =>
                cardCondition(card, context) && this.properties.gameAction.some((gameAction: any) => gameAction.canAffect(card, context));
        }
        this.hideIfNoLegalTargets = properties.hideIfNoLegalTargets;
        this.selector = properties.selector || CardSelector.for(this.properties);
        this.selectedCards = [];
        this.onlyMustSelectMayBeChosen = false;
        this.cannotUnselectMustSelect = false;
        this.targets = [];
        this.previouslySelectedCards = [];
        if(properties.mustSelect) {
            if(this.selector.hasEnoughSelected(properties.mustSelect, properties.context) && this.selector.numCards > 0 && properties.mustSelect.length >= this.selector.numCards) {
                this.onlyMustSelectMayBeChosen = true;
            } else {
                this.selectedCards = [...properties.mustSelect];
                this.cannotUnselectMustSelect = true;
            }
        }
        this.savePreviouslySelectedCards();
    }

    defaultProperties(): Record<string, any> {
        return {
            buttons: [],
            controls: this.getDefaultControls(),
            selectCard: true,
            cardCondition: () => true,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true,
            hideIfNoLegalTargets: false
        };
    }

    getDefaultControls(): any[] {
        let targets = this.context.targets ? Object.values(this.context.targets) : [];
        targets = (targets as any[]).reduce((array: any[], target: any) => array.concat(target), []);
        if((targets as any[]).length === 0 && this.context.event && this.context.event.card) {
            this.targets = [this.context.event.card];
        }
        return [{
            type: 'targeting',
            source: this.context.source.getShortSummary(),
            targets: (targets as any[]).map((target: any) => target.getShortSummaryForControls(this.choosingPlayer))
        }];
    }

    savePreviouslySelectedCards(): void {
        this.previouslySelectedCards = (this.choosingPlayer as any).selectedCards;
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.setSelectedCards(this.selectedCards);
    }

    continue(): boolean {
        if(this.hideIfNoLegalTargets && this.selector.optional && !this.selector.hasEnoughTargets(this.context, this.choosingPlayer)) {
            this.complete();
        }

        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards(): void {
        this.choosingPlayer.setSelectableCards(this.selector.findPossibleCards(this.context).filter((card: any) => this.checkCardCondition(card)));
    }

    activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = this.properties.buttons;
        if(!this.selector.automaticFireOnSelect(this.context) && this.selector.hasEnoughSelected(this.selectedCards, this.context) || this.selector.optional) {
            if(buttons.every((button: any) => button.arg !== 'done')) {
                buttons = [{ text: 'Done', arg: 'done' }].concat(buttons);
            }
        }
        if(this.game.manualMode && buttons.every((button: any) => button.arg !== 'cancel')) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            selectCard: this.properties.selectCard,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.selector.defaultActivePromptTitle(this.context),
            buttons: buttons,
            promptTitle: this.properties.source ? this.properties.source.name : undefined,
            controls: this.properties.controls
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player: Player, card: any): boolean {
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

    checkCardCondition(card: any): boolean {
        if(this.onlyMustSelectMayBeChosen && !this.properties.mustSelect.includes(card)) {
            return false;
        } else if(this.selectedCards.includes(card)) {
            return true;
        }

        return (
            this.selector.canTarget(card, this.context, this.choosingPlayer, this.selectedCards) &&
            !this.selector.wouldExceedLimit(this.selectedCards, card)
        );
    }

    selectCard(card: any): boolean {
        if(this.selector.hasReachedLimit(this.selectedCards, this.context) && !this.selectedCards.includes(card)) {
            return false;
        } else if(this.cannotUnselectMustSelect && this.properties.mustSelect.includes(card)) {
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
        let cardParam = this.selector.formatSelectParam(this.selectedCards);
        if(this.properties.onSelect(this.choosingPlayer, cardParam)) {
            this.complete();
            return true;
        }
        this.clearSelection();
        return false;
    }

    menuCommand(player: Player, arg: string): boolean {
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

    complete(): void {
        this.clearSelection();
        return super.complete();
    }

    clearSelection(): void {
        this.selectedCards = [];
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();
        this.choosingPlayer.clearSelectableRings();

        // Restore previous selections.
        this.choosingPlayer.setSelectedCards(this.previouslySelectedCards);
    }
}

export default SelectCardPrompt;
