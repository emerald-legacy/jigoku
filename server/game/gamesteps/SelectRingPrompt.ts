import { AbilityContext } from '../AbilityContext.js';
import EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type Ring from '../Ring.js';
import type BaseCard from '../BaseCard.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';

interface SelectRingPromptButton {
    text?: string;
    arg?: string;
    [key: string]: unknown;
}

interface SelectRingPromptProperties {
    source?: EffectSource | string;
    context?: AbilityContext;
    waitingPromptTitle?: string;
    activePromptTitle?: string;
    ordered?: boolean;
    buttons?: SelectRingPromptButton[];
    optional?: boolean;
    hideIfNoLegalTargets?: boolean;
    ringCondition?(ring: Ring, context: AbilityContext): boolean;
    onSelect?(player: Player, ring: Ring): boolean | void;
    onMenuCommand?(player: Player, arg: string): boolean | void;
    onCancel?(player: Player): boolean | void;
    [key: string]: unknown;
}

/**
 * General purpose prompt that asks the user to select a ring.
 *
 * The properties option object has the following properties:
 * additionalButtons  - array of additional buttons for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * ringCondition      - a function that takes a ring and should return a boolean
 *                      on whether that ring is elligible to be selected.
 * onSelect           - a callback that is called as soon as an elligible ring
 *                      is clicked. If the callback does not return true, the
 *                      prompt is not marked as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any rings.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class SelectRingPrompt extends UiPrompt {
    choosingPlayer: Player;
    properties: SelectRingPromptProperties;
    context: AbilityContext;
    selectedRing: Ring | null;
    targets: unknown[];

    constructor(game: Game, choosingPlayer: Player, properties: SelectRingPromptProperties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
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
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: properties.source as EffectSource });
        // Apply defaults for missing properties
        const defaults = this.defaultProperties();
        for(const key in defaults) {
            if(this.properties[key] === undefined) {
                this.properties[key] = defaults[key];
            }
        }
        this.selectedRing = null;
        this.targets = [];
    }

    defaultProperties(): Record<string, unknown> {
        return {
            buttons: [],
            controls: this.getDefaultControls(),
            ringCondition: () => true,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true,
            optional: false,
            hideIfNoLegalTargets: false
        };
    }

    getDefaultControls(): Array<{ type: string; source: unknown; targets: unknown[] }> {
        if(!this.properties.context) {
            return [];
        }
        let targets: unknown[] = this.properties.context.targets ? Object.values(this.properties.context.targets as Record<string, BaseCard>).map((target: BaseCard) => target.getShortSummaryForControls(this.choosingPlayer)) : [];
        const triggeredContext = this.properties.context as TriggeredAbilityContext;
        if(targets.length === 0 && triggeredContext.event && triggeredContext.event.card) {
            this.targets = [triggeredContext.event.card.getShortSummaryForControls(this.choosingPlayer)];
        }
        return [{
            type: 'targeting',
            source: this.properties.context.source.getShortSummary(),
            targets: targets
        }];
    }

    activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    continue(): boolean {
        if(this.properties.hideIfNoLegalTargets && this.properties.optional && this.getSelectableRings().length === 0) {
            this.complete();
        }

        if(!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    highlightSelectableRings(): void {
        this.choosingPlayer.setSelectableRings(this.getSelectableRings());
    }

    getSelectableRings(): Ring[] {
        let selectableRings = Object.values(this.game.rings).filter((ring: Ring) => {
            return (this.properties.ringCondition ?? (() => true))(ring, this.context);
        });

        return selectableRings;
    }

    activePrompt() {
        let buttons = this.properties.buttons ?? [];
        if(this.properties.optional) {
            buttons.push({ text: 'Done', arg: 'done' });
        }
        if(this.game.manualMode && !buttons.some((button: SelectRingPromptButton) => button.arg === 'cancel')) {
            buttons.push({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            source: this.properties.source,
            selectCard: true,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.defaultActivePromptTitle(),
            buttons: buttons,
            promptTitle: this.properties.source ? (this.properties.source as EffectSource).name : undefined
        };
    }

    defaultActivePromptTitle(): string {
        return 'Choose a ring';
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onRingClicked(player: Player, ring: Ring): boolean {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!(this.properties.ringCondition ?? (() => true))(ring, this.context)) {
            return true;
        }

        if((this.properties.onSelect ?? (() => true))(player, ring)) {
            this.complete();
        }

        return true;
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'cancel') {
            (this.properties.onCancel ?? (() => true))(player);
            this.complete();
            return true;
        } else if((this.properties.onMenuCommand ?? (() => true))(player, arg)) {
            this.complete();
            return true;
        }
        return false;
    }

    complete(): void {
        this.choosingPlayer.clearSelectableRings();
        return super.complete();
    }
}

export default SelectRingPrompt;
