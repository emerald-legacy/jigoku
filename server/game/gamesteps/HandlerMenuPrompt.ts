import { AbilityContext } from '../AbilityContext.js';
import EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type BaseCard from '../BaseCard.js';
import type { GameObject } from '../GameObject.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';

type HandlerMenuButton = { text: string | number | undefined; arg: string | number; card?: BaseCard; disabled?: boolean };

interface HandlerMenuPromptProperties {
    source?: EffectSource | string;
    context?: AbilityContext;
    waitingPromptTitle?: string;
    activePromptTitle?: string;
    choices?: Array<string | number | undefined>;
    handlers?: Array<() => void>;
    choiceHandler?(choice: string | number | undefined): void;
    cards?: BaseCard[];
    cardCondition?(card: BaseCard, context: AbilityContext): boolean;
    cardHandler?(card: BaseCard): void;
    controls?: { type: string; targets: BaseCard[] } | Array<{ type: string; source: unknown; targets: unknown[] }>;
    target?: GameObject | GameObject[];
    [key: string]: unknown;
}

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
    properties: HandlerMenuPromptProperties;
    cardCondition: (card: BaseCard, context: AbilityContext) => boolean;
    context: AbilityContext;

    constructor(game: Game, player: Player, properties: HandlerMenuPromptProperties) {
        super(game);
        this.player = player;
        if(typeof properties.source === 'string') {
            properties.source = new EffectSource(game, properties.source);
        } else if(properties.context && properties.context.source) {
            properties.source = properties.context.source;
        }
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + (properties.source as EffectSource).name;
        } else if(!properties.source) {
            properties.source = new EffectSource(game);
        }
        this.properties = properties;
        this.properties.choices = properties.choices || [];
        this.cardCondition = properties.cardCondition || (() => true);
        this.context = properties.context || new AbilityContext({ game: game, player: player, source: properties.source as EffectSource });
    }

    activeCondition(player: Player): boolean {
        return player === this.player;
    }

    activePrompt() {
        let buttons: HandlerMenuButton[] = [];
        if(this.properties.cards) {
            let cardQuantities: Record<string, number> = {};
            this.properties.cards.forEach((card: BaseCard) => {
                if(cardQuantities[card.id]) {
                    cardQuantities[card.id] += 1;
                } else {
                    cardQuantities[card.id] = 1;
                }
            });
            // Get unique cards by id
            const seenIds = new Set<string>();
            let cards = this.properties.cards.filter((card: BaseCard) => {
                if(seenIds.has(card.id)) {
                    return false;
                }
                seenIds.add(card.id);
                return true;
            });
            buttons = cards.map((card: BaseCard) => {
                let text = card.name;
                if(cardQuantities[card.id] > 1) {
                    text = text + ' (' + cardQuantities[card.id].toString() + ')';
                }
                return { text: text, arg: card.id, card: card, disabled: !this.cardCondition(card, this.context) };
            });
        }
        buttons = buttons.concat((this.properties.choices ?? []).map((choice: string | number | undefined, index: number) => {
            return { text: choice, arg: index };
        }));
        if(this.game.manualMode && (!this.properties.choices || this.properties.choices.every((choice: string | number | undefined) => choice !== 'Cancel'))) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            menuTitle: this.properties.activePromptTitle || 'Select one',
            buttons: buttons,
            controls: this.getAdditionalPromptControls(),
            promptTitle: (this.properties.source as EffectSource).name
        };
    }

    getAdditionalPromptControls(): Array<{ type: string; source: unknown; targets: unknown[] }> {
        const controls = this.properties.controls;
        if(controls && !Array.isArray(controls) && controls.type === 'targeting') {
            return [{
                type: 'targeting',
                source: (this.properties.source as EffectSource).getShortSummary(),
                targets: controls.targets.map((target: BaseCard) => target.getShortSummaryForControls(this.player))
            }];
        }
        if((this.context.source.type as string) === '') {
            return [];
        }
        const rawTargets: Array<BaseCard | BaseCard[]> = this.context.targets ? Object.values(this.context.targets) : [];
        let targets: GameObject[] = rawTargets.reduce((array: GameObject[], target: BaseCard | BaseCard[]) => array.concat(target), [] as GameObject[]);
        if(this.properties.target) {
            targets = Array.isArray(this.properties.target) ? this.properties.target : [this.properties.target];
        }
        const triggeredContext = this.context as TriggeredAbilityContext;
        if(targets.length === 0 && triggeredContext.event && triggeredContext.event.card) {
            targets = [triggeredContext.event.card];
        }
        return [{
            type: 'targeting',
            source: this.context.source.getShortSummary(),
            targets: targets.map((target: GameObject) => target.getShortSummaryForControls(this.player))
        }];
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player: Player, arg: string | number): boolean {
        if(typeof arg === 'string') {
            if(arg === 'cancel') {
                this.complete();
                return true;
            }
            let card = this.properties.cards && this.properties.cards.find((card: BaseCard) => card.id === arg);
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
            this.properties.choiceHandler((this.properties.choices ?? [])[arg]);
            this.complete();
            return true;
        }

        const handlers = this.properties.handlers as Array<() => void>;
        if(!handlers[arg]) {
            return false;
        }

        handlers[arg]();
        this.complete();

        return true;
    }
}

export default HandlerMenuPrompt;
