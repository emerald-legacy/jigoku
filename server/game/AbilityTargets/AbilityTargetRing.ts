import { AbilityTargetBase } from './AbilityTargetBase.js';
import { Stage, Players } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import type Player from '../Player.js';
import type { ActionOverrides, GameAction, HeldAction } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { PromptButton } from '../PlayerPromptState.js';
import { waitingPromptTitle } from './TargetPrompt.js';

interface AbilityTargetRingProperties {
    gameAction: GameAction[];
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    optional?: boolean;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

export class AbilityTargetRing extends AbilityTargetBase<AbilityTargetRingProperties> {
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;

    constructor(name: string, properties: AbilityTargetRingProperties, ability: OwningAbility) {
        super(name, properties, ability);
        this.ringCondition = (ring: Ring, context: AbilityContext) => {
            const contextCopy = context.copy({});
            contextCopy.rings[this.name] = ring;
            if(this.name === 'target') {
                contextCopy.ring = ring;
            }
            if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (properties.gameAction.length === 0 || properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy, this.actionOverrides(contextCopy)))) &&
                   properties.ringCondition(ring, contextCopy) && (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy));
        };
    }

    hasLegalTarget(context: AbilityContext): boolean {
        return Object.values(context.game.rings).some((ring) => this.properties.optional || this.ringCondition(ring, context));
    }

    getGameAction(context: AbilityContext): HeldAction[] {
        const overrides = this.actionOverrides(context);
        return this.properties.gameAction
            .filter((action) => action.hasLegalTarget(context, overrides))
            .map((action) => ({ action, overrides }));
    }

    protected actionOverrides(context: AbilityContext): ActionOverrides {
        return { target: context.rings[this.name] };
    }

    getAllLegalTargets(context: AbilityContext): Ring[] {
        return Object.values(context.game.rings).filter((ring) => this.ringCondition(ring, context));
    }

    resolve(context: AbilityContext, targetResults: TargetResults): void {
        const chooser = this.chooserNow(context, targetResults);
        if(!chooser) {
            return;
        }
        const { player } = chooser;
        const buttons: PromptButton[] = [];
        if(context.stage === Stage.PreTarget) {
            buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        const promptProperties = {
            waitingPromptTitle: context.stage === Stage.PreTarget ? waitingPromptTitle(context) : '',
            context: context,
            buttons: buttons,
            onSelect: (_player: Player, ring: Ring) => {
                context.rings[this.name] = ring;
                if(this.name === 'target') {
                    context.ring = ring;
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (_player: Player, arg: string) => {
                if(arg === 'costsFirst') {
                    targetResults.payCostsFirst = true;
                    return true;
                }
                return true;
            }
        };
        if(!player) {
            // a solo game has no opponent to choose
            return;
        }
        context.game.promptForRingSelect(player, Object.assign({}, promptProperties, this.properties));
    }

    checkTarget(context: AbilityContext): boolean {
        const selected = context.rings[this.name];
        if(!selected || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        // a skipped optional target holds []
        if(Array.isArray(selected)) {
            return !!this.properties.optional && selected.length === 0;
        }
        return this.properties.ringCondition(selected, context);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context, this.actionOverrides(context)))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}

