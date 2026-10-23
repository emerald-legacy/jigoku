import { AbilityTargetBase, type AbilityTargetBaseProperties } from './AbilityTargetBase.js';
import { Stage } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import type Player from '../Player.js';
import type { ActionOverrides, GameAction, HeldAction } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';

interface AbilityTargetRingProperties extends AbilityTargetBaseProperties {
    gameAction: GameAction[];
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    optional?: boolean;
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
        return this.heldActions(this.properties.gameAction, context);
    }

    protected override actionOverrides(context: AbilityContext): ActionOverrides {
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
        const promptProperties = {
            ...this.targetPromptProperties(context, targetResults),
            onSelect: (_player: Player, ring: Ring) => {
                context.rings[this.name] = ring;
                if(this.name === 'target') {
                    context.ring = ring;
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
        if(!selected || this.mustBeChosenAgain(context)) {
            return false;
        }
        // a skipped optional target holds []
        if(Array.isArray(selected)) {
            return !!this.properties.optional && selected.length === 0;
        }
        return this.properties.ringCondition(selected, context);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.chosenByInitiatingPlayer(this.properties.gameAction, context);
    }
}

