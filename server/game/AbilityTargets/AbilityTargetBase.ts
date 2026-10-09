import { Players, Stage } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { DependentTarget, OwningAbility, TargetResults } from '../BaseAbility.js';
import type Player from '../Player.js';
import type { ActionOverrides, HeldAction } from '../GameActions/GameAction.js';

export interface AbilityTargetBaseProperties {
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

/** What every kind of ability target shares: its name, the target depending on it, and who chooses it. */
export abstract class AbilityTargetBase<P extends AbilityTargetBaseProperties> {
    dependentTarget: DependentTarget | null = null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null = null;

    constructor(public name: string, public properties: P, ability: OwningAbility) {
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

    getChoosingPlayer(context: AbilityContext): Player | undefined {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }

    /**
     * Who chooses this target now, or nothing when targeting stopped or this target waits:
     * the opponent chooses after costs are paid. In a solo game the chooser may be missing.
     */
    protected chooserNow(
        context: AbilityContext,
        targetResults: TargetResults,
        override: Player | null | undefined = context.choosingPlayerOverride
    ): { player: Player | undefined } | undefined {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return undefined;
        }
        const player = override || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stage.PreTarget) {
            targetResults.delayTargeting = this;
            return undefined;
        }
        return { player };
    }
}
