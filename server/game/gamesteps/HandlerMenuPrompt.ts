import { AbilityContext } from '../AbilityContext.js';
import { Event } from '../Events/Event.js';
import type EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import { resolvePromptSource } from './PromptSource.js';
import type { PromptButton, PromptControl } from '../PlayerPromptState.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type BaseCard from '../BaseCard.js';
import type { GameObject } from '../GameObject.js';

type Choice = string | number | undefined;

/** A menu button and what clicking it does. */
export interface HandlerMenuOption {
    text: Choice;
    handler: () => void;
}

export interface HandlerMenuPromptProperties<T extends BaseCard = BaseCard, C extends Choice = Choice> {
    source?: EffectSource | string;
    context?: AbilityContext;
    waitingPromptTitle?: string;
    activePromptTitle?: string;
    options?: HandlerMenuOption[];
    /** Labels computed at run time, all handled by `choiceHandler`; not together with `options`. */
    choices?: C[];
    choiceHandler?: (choice: C) => void;
    cards?: T[];
    cardCondition?: (card: T, context: AbilityContext) => boolean;
    cardHandler?: (card: T) => void;
    controls?: PromptControl[];
    target?: GameObject | GameObject[];
}

type ResolvedHandlerMenuPromptProperties<T extends BaseCard, C extends Choice> = HandlerMenuPromptProperties<T, C> & { source: EffectSource; choices: C[] };

/**
 * General purpose menu prompt.
 *
 * The properties option object may contain the following:
 * options            - the menu buttons, each with the handler it calls
 * choices            - titles for menu buttons computed at run time
 * choiceHandler      - handler which is called with the clicked choice
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * cards              - a list of cards to display as buttons with mouseover support
 * cardCondition      - disables the prompt buttons for any cards which return false
 * cardHandler        - handler which is called when a card button is clicked
 */
class HandlerMenuPrompt<T extends BaseCard = BaseCard, C extends Choice = Choice> extends UiPrompt {
    player: Player;
    properties: ResolvedHandlerMenuPromptProperties<T, C>;
    cardCondition: (card: T, context: AbilityContext) => boolean;
    context: AbilityContext;
    source: EffectSource;

    constructor(game: Game, player: Player, properties: HandlerMenuPromptProperties<T, C>) {
        super(game);
        this.player = player;
        if(properties.options && properties.choices?.length) {
            throw new Error('a handler menu takes options or choices, not both');
        }
        const { source, waitingPromptTitle } = resolvePromptSource(game, properties);
        this.source = source;
        this.properties = { ...properties, source, waitingPromptTitle, choices: properties.choices || [] };
        this.cardCondition = properties.cardCondition || (() => true);
        this.context = properties.context || new AbilityContext({ game: game, player: player, source: source });
    }

    activeCondition(player: Player): boolean {
        return player === this.player;
    }

    activePrompt() {
        let buttons: PromptButton[] = [];
        if(this.properties.cards) {
            const cardQuantities: Record<string, number> = {};
            this.properties.cards.forEach((card) => {
                if(cardQuantities[card.id]) {
                    cardQuantities[card.id] += 1;
                } else {
                    cardQuantities[card.id] = 1;
                }
            });
            // Get unique cards by id
            const seenIds = new Set<string>();
            const cards = this.properties.cards.filter((card) => {
                if(seenIds.has(card.id)) {
                    return false;
                }
                seenIds.add(card.id);
                return true;
            });
            buttons = cards.map((card) => {
                let text = card.name;
                if(cardQuantities[card.id] > 1) {
                    text = text + ' (' + cardQuantities[card.id].toString() + ')';
                }
                return { text: text, arg: card.id, card: card, disabled: !this.cardCondition(card, this.context) };
            });
        }
        const labels: Choice[] = this.properties.options ? this.properties.options.map((option) => option.text) : this.properties.choices;
        buttons = buttons.concat(labels.map((text, index) => ({ text, arg: index })));
        if(this.game.manualMode && labels.every((label) => label !== 'Cancel')) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            menuTitle: this.properties.activePromptTitle || 'Select one',
            buttons: buttons,
            controls: this.getAdditionalPromptControls(),
            promptTitle: this.source.name
        };
    }

    getAdditionalPromptControls(): PromptControl[] {
        // a source that is not a card has no type
        const sourceType: string = this.context.source.type;
        if(sourceType === '') {
            return [];
        }
        const rawTargets: Array<BaseCard | BaseCard[]> = this.context.targets ? Object.values(this.context.targets) : [];
        let targets: GameObject[] = rawTargets.flat();
        if(this.properties.target) {
            targets = Array.isArray(this.properties.target) ? this.properties.target : [this.properties.target];
        }
        const eventCard = Event.promptCardOf('event' in this.context ? this.context.event : undefined);
        if(targets.length === 0 && eventCard) {
            targets = [eventCard];
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

    menuCommand(_player: Player, arg: string | number): boolean {
        if(typeof arg === 'string') {
            if(arg === 'cancel') {
                this.complete();
                return true;
            }
            const card = this.properties.cards && this.properties.cards.find((card) => card.id === arg);
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

        const option = this.properties.options?.[arg];
        if(!option) {
            return false;
        }

        option.handler();
        this.complete();

        return true;
    }
}

export default HandlerMenuPrompt;
