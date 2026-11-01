import { Players, Stage } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { DependentTarget, OwningAbility, TargetResults } from '../BaseAbility.js';
import type Player from '../Player.js';
import type { ActionOverrides, GameAction, HeldAction } from '../GameActions/GameAction.js';
import type { PromptButton } from '../PlayerPromptState.js';
import { waitingPromptTitle, type CardSelectorInstance } from './TargetPrompt.js';
import type BaseCard from '../BaseCard.js';
import { resolveChoosingPlayer } from '../GameActions/resolveChoosingPlayer.js';

/** What every kind of target declares: the target it depends on, and who chooses it (the ability's player by default). */
export interface AbilityTargetBaseProperties {
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

/** What every kind of ability target shares: its name, the target depending on it, and who chooses it. */
export abstract class AbilityTargetBase<Properties extends AbilityTargetBaseProperties> {
    dependentTarget: DependentTarget | null = null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null = null;

    constructor(public name: string, public properties: Properties, ability: OwningAbility) {
        if(properties.dependsOn) {
            const dependsOnTarget = ability.targets.find((target) => target.name === properties.dependsOn);
            if(dependsOnTarget) {
                dependsOnTarget.dependentTarget = this;
            }
        }
    }

    abstract hasLegalTarget(context: AbilityContext): boolean;
    abstract resolve(context: AbilityContext, targetResults: TargetResults): void;
    abstract checkTarget(context: AbilityContext): boolean;
    abstract hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean;
    abstract getGameAction(context: AbilityContext): HeldAction[];

    /** What this target's game actions get: what was chosen for it. */
    protected actionOverrides(_context: AbilityContext): ActionOverrides {
        return {};
    }

    canResolve(context: AbilityContext): boolean {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    /** Whoever chooses for the ability's player instead (Hantei XXXVIII) chooses again: a choice made earlier doesn't count. */
    protected mustBeChosenAgain(context: AbilityContext): boolean {
        return !!context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player;
    }

    /** The ability's player chooses this target, or a target of one of `actions`. */
    protected chosenByInitiatingPlayer(actions: GameAction[], context: AbilityContext): boolean {
        return actions.some((action) => action.hasTargetsChosenByInitiatingPlayer(context, this.actionOverrides(context))) ||
            this.getChoosingPlayer(context) === context.player;
    }

    getChoosingPlayer(context: AbilityContext): Player | undefined {
        const player = typeof this.properties.player === 'function' ? this.properties.player(context) : this.properties.player;
        return resolveChoosingPlayer(context, player === Players.Opponent ? Players.Opponent : Players.Self);
    }

    /** The game actions that can resolve now, each with what was chosen for this target. */
    protected heldActions(actions: GameAction[], context: AbilityContext): HeldAction[] {
        const overrides = this.actionOverrides(context);
        return actions
            .filter((action) => action.hasLegalTarget(context, overrides))
            .map((action) => ({ action, overrides }));
    }

    /** What a prompt for this target always has: before costs are paid, the buttons to pay them first or cancel. */
    protected targetPromptProperties(context: AbilityContext, targetResults: TargetResults) {
        const buttons: PromptButton[] = [];
        if(context.stage === Stage.PreTarget) {
            // a cost that depends on a target (an attachment's reducers) can't be paid before it's chosen
            if(!context.ability.cost.some((cost) => cost.dependsOn)) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        return {
            waitingPromptTitle: context.stage === Stage.PreTarget ? waitingPromptTitle(context) : '',
            context,
            buttons,
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (_player: Player, arg: string) => {
                if(arg === 'costsFirst') {
                    targetResults.payCostsFirst = true;
                }
                return true;
            }
        };
    }

    /**
     * Who chooses this target now, or nothing when targeting stopped or this target waits (the opponent chooses
     * after costs are paid), or when a solo game has no opponent to choose.
     */
    protected chooserNow(
        context: AbilityContext,
        targetResults: TargetResults,
        override: Player | null | undefined = context.choosingPlayerOverride
    ): Player | undefined {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return undefined;
        }
        const player = override || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stage.PreTarget) {
            targetResults.delayTargeting = this;
            return undefined;
        }
        return player;
    }
}

export interface SelectorTargetProperties extends AbilityTargetBaseProperties {
    gameAction: GameAction[];
}

/** A target chosen by clicking a card, then something on it (an ability, element symbol or status token). */
export abstract class SelectorTargetBase<Properties extends SelectorTargetProperties> extends AbilityTargetBase<Properties> {
    abstract selector: CardSelectorInstance;

    hasLegalTarget(context: AbilityContext): boolean {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getAllLegalTargets(context: AbilityContext): BaseCard[] {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context: AbilityContext): HeldAction[] {
        return this.heldActions(this.properties.gameAction, context);
    }
}
