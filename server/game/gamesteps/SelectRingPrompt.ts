import { AbilityContext } from '../AbilityContext.js';
import type EffectSource from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import { resolvePromptSource } from './PromptSource.js';
import type { PromptButton } from '../PlayerPromptState.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type Ring from '../Ring.js';

interface SelectRingPromptProperties {
    source?: EffectSource | string;
    context?: AbilityContext;
    waitingPromptTitle?: string;
    activePromptTitle?: string;
    ordered?: boolean;
    buttons?: PromptButton[];
    optional?: boolean;
    hideIfNoLegalTargets?: boolean;
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
    onSelect?: (player: Player, ring: Ring) => boolean | void;
    onMenuCommand?: (player: Player, arg: string) => boolean | void;
    onCancel?: (player: Player) => boolean | void;
}

type DefaultedProperties = 'buttons' | 'ringCondition' | 'onSelect' | 'onMenuCommand' | 'onCancel' | 'optional' | 'hideIfNoLegalTargets';

type ResolvedSelectRingPromptProperties = SelectRingPromptProperties & Required<Pick<SelectRingPromptProperties, DefaultedProperties>> & { source: EffectSource };

/**
 * General purpose prompt that asks the user to select a ring.
 *
 * The properties option object has the following properties:
 * buttons            - array of additional buttons for the prompt.
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
    properties: ResolvedSelectRingPromptProperties;
    context: AbilityContext;
    selectedRing: Ring | null;

    constructor(game: Game, choosingPlayer: Player, properties: SelectRingPromptProperties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        const { source, waitingPromptTitle } = resolvePromptSource(game, properties);
        this.properties = {
            ...properties,
            source,
            waitingPromptTitle,
            buttons: properties.buttons ?? [],
            ringCondition: properties.ringCondition ?? (() => true),
            onSelect: properties.onSelect ?? (() => true),
            onMenuCommand: properties.onMenuCommand ?? (() => true),
            onCancel: properties.onCancel ?? (() => true),
            optional: properties.optional ?? false,
            hideIfNoLegalTargets: properties.hideIfNoLegalTargets ?? false
        };
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: source });
        this.selectedRing = null;
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
        const selectableRings = Object.values(this.game.rings).filter((ring: Ring) => {
            return this.properties.ringCondition(ring, this.context);
        });

        return selectableRings;
    }

    activePrompt() {
        const buttons = [...this.properties.buttons];
        if(this.properties.optional) {
            buttons.push({ text: 'Done', arg: 'done' });
        }
        if(this.game.manualMode && !buttons.some((button: PromptButton) => button.arg === 'cancel')) {
            buttons.push({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            source: this.properties.source,
            selectCard: true,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.defaultActivePromptTitle(),
            buttons: buttons,
            promptTitle: this.properties.source.name
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

        if(!this.properties.ringCondition(ring, this.context)) {
            return true;
        }

        if(this.properties.onSelect(player, ring)) {
            this.complete();
        }

        return true;
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'cancel') {
            this.properties.onCancel(player);
            this.complete();
            return true;
        } else if(this.properties.onMenuCommand(player, arg)) {
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
