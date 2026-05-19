import { AbilityContext } from '../AbilityContext.js';
import EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import type Player from '../player.js';

/**
 * General purpose menu prompt. Takes a choices object with menu options and
 * a handler for each. Handlers should return true in order to complete the
 * prompt.
 *
 * The properties option object may contain the following:
 * choices            - an array of titles for menu buttons
 * handlers           - an array of handlers corresponding to the menu buttons
 * choiceHandler      - handler which is called when a choice button is clicked
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * cards              - a list of cards to display as buttons with mouseover support
 * cardCondition      - disables the prompt buttons for any cards which return false
 * cardHandler        - handler which is called when a card button is clicked
 */
class HandlerMenuPrompt extends UiPrompt {
    player: Player;
    properties: any;
    cardCondition: (card: any, context: any) => boolean;
    context: any;

    constructor(game: any, player: Player, properties: any) {
        super(game);
        this.player = player;
        if(typeof properties.source === 'string') {
            properties.source = new EffectSource(game, properties.source);
        } else if(properties.context && properties.context.source) {
            properties.source = properties.context.source;
        }
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        } else if(!properties.source) {
            properties.source = new EffectSource(game);
        }
        this.properties = properties;
        this.properties.choices = properties.choices || [];
        this.cardCondition = properties.cardCondition || (() => true);
        this.context = properties.context || new AbilityContext({ game: game, player: player, source: properties.source });
    }

    activeCondition(player: Player): boolean {
        return player === this.player;
    }

    activePrompt() {
        let buttons: any[] = [];
        if(this.properties.cards) {
            let cardQuantities: Record<string, number> = {};
            this.properties.cards.forEach((card: any) => {
                if(cardQuantities[card.id]) {
                    cardQuantities[card.id] += 1;
                } else {
                    cardQuantities[card.id] = 1;
                }
            });
            // Get unique cards by id
            const seenIds = new Set<string>();
            let cards = this.properties.cards.filter((card: any) => {
                if(seenIds.has(card.id)) {
                    return false;
                }
                seenIds.add(card.id);
                return true;
            });
            buttons = cards.map((card: any) => {
                let text = card.name;
                if(cardQuantities[card.id] > 1) {
                    text = text + ' (' + cardQuantities[card.id].toString() + ')';
                }
                return { text: text, arg: card.id, card: card, disabled: !this.cardCondition(card, this.context) };
            });
        }
        buttons = buttons.concat(this.properties.choices.map((choice: string, index: number) => {
            return { text: choice, arg: index };
        }));
        if(this.game.manualMode && (!this.properties.choices || this.properties.choices.every((choice: string) => choice !== 'Cancel'))) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            menuTitle: this.properties.activePromptTitle || 'Select one',
            buttons: buttons,
            controls: this.getAdditionalPromptControls(),
            promptTitle: this.properties.source.name
        };
    }

    getAdditionalPromptControls(): any[] {
        if(this.properties.controls && this.properties.controls.type === 'targeting') {
            return [{
                type: 'targeting',
                source: this.properties.source.getShortSummary(),
                targets: this.properties.controls.targets.map((target: any) => target.getShortSummaryForControls(this.player))
            }];
        }
        if(this.context.source.type === '') {
            return [];
        }
        let targets = this.context.targets ? Object.values(this.context.targets) : [];
        targets = (targets as any[]).reduce((array: any[], target: any) => array.concat(target), []);
        if(this.properties.target) {
            targets = Array.isArray(this.properties.target) ? this.properties.target : [this.properties.target];
        }
        if((targets as any[]).length === 0 && this.context.event && this.context.event.card) {
            targets = [this.context.event.card];
        }
        return [{
            type: 'targeting',
            source: this.context.source.getShortSummary(),
            targets: (targets as any[]).map((target: any) => target.getShortSummaryForControls(this.player))
        }];
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player: Player, arg: any): boolean {
        if(typeof arg === 'string') {
            if(arg === 'cancel') {
                this.complete();
                return true;
            }
            let card = this.properties.cards && this.properties.cards.find((card: any) => card.id === arg);
            if(card && this.properties.cardHandler) {
                if(!this.cardCondition(card, this.context)) {
                    return false;
                }
                this.properties.cardHandler(card);
                this.complete();
                return true;
            }
            return false;
        }

        if(this.properties.choiceHandler) {
            this.properties.choiceHandler(this.properties.choices[arg]);
            this.complete();
            return true;
        }

        if(!this.properties.handlers[arg]) {
            return false;
        }

        this.properties.handlers[arg]();
        this.complete();

        return true;
    }
}

export default HandlerMenuPrompt;
