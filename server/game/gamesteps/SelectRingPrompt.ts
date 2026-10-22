import { AbilityContext } from '../AbilityContext.js';
import type { EffectSource } from '../EffectSource.js';
import { UiPrompt } from './UiPrompt.js';
import { resolvePromptSource } from './PromptSource.js';
import type { PromptButton } from '../PlayerPromptState.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type Ring from '../Ring.js';

interface SelectRingPromptProperties {
    /** Where the prompt comes from, usually a card; it gives the default waiting title. */
    source?: EffectSource | string;
    context?: AbilityContext;
    waitingPromptTitle?: string;
    activePromptTitle?: string;
    ordered?: boolean;
    buttons?: PromptButton[];
    optional?: boolean;
    hideIfNoLegalTargets?: boolean;
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
    /** Runs as soon as a legal ring is clicked; the prompt is complete only when it returns true. */
    onSelect?: (player: Player, ring: Ring) => boolean | void;
    /** One of the extra `buttons` was clicked. */
    onMenuCommand?: (player: Player, arg: string) => boolean | void;
    /** Done was clicked with no ring selected. */
    onCancel?: (player: Player) => boolean | void;
}

type DefaultedProperties = 'buttons' | 'ringCondition' | 'onSelect' | 'onMenuCommand' | 'onCancel' | 'optional' | 'hideIfNoLegalTargets';

type ResolvedSelectRingPromptProperties = SelectRingPromptProperties & Required<Pick<SelectRingPromptProperties, DefaultedProperties>> & { source: EffectSource };

/** Asks a player to select a ring; what may be chosen and what happens is in `SelectRingPromptProperties`. */
export class SelectRingPrompt extends UiPrompt {
    choosingPlayer: Player;
    properties: ResolvedSelectRingPromptProperties;
    context: AbilityContext;

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
    }

    override activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    override continue(): boolean {
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

    override activePrompt() {
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

    override waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    override onRingClicked(player: Player, ring: Ring): boolean {
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

    override menuCommand(player: Player, arg: string): boolean {
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

    override complete(): void {
        this.choosingPlayer.clearSelectableRings();
        return super.complete();
    }
}

