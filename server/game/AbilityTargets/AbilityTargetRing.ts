import { Stages, Players } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';

interface OwningAbility {
    targets: { name: string }[];
}

interface AbilityTargetRingProperties {
    gameAction: GameAction[];
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    optional?: boolean;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
    [key: string]: unknown;
}

interface RingTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTargetRing | null;
    noCostsFirstButton?: boolean;
}

interface PromptButton {
    text: string;
    arg: string;
}

class AbilityTargetRing {
    name: string;
    properties: AbilityTargetRingProperties;
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    dependentTarget: AbilityTargetRing | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetRingProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        this.ringCondition = (ring: Ring, context: AbilityContext) => {
            let contextCopy = context.copy({});
            contextCopy.rings[this.name] = ring;
            if(this.name === 'target') {
                contextCopy.ring = ring;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (properties.gameAction.length === 0 || properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy))) &&
                   properties.ringCondition(ring, contextCopy) && (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy));
        };
        for(let gameAction of this.properties.gameAction) {
            gameAction.getDefaultTargets = (context: AbilityContext) => context.rings[name];
        }
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                (dependsOnTarget as AbilityTargetRing).dependentTarget = this;
            }
        }
    }

    canResolve(context: AbilityContext): boolean {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context: AbilityContext): boolean {
        return Object.values(context.game.rings).some((ring) => this.properties.optional || this.ringCondition(ring, context));
    }

    getGameAction(context: AbilityContext): GameAction[] {
        return this.properties.gameAction.filter((gameAction) => gameAction.hasLegalTarget(context));
    }

    getAllLegalTargets(context: AbilityContext): Ring[] {
        return Object.values(context.game.rings).filter((ring) => this.ringCondition(ring, context));
    }

    resolve(context: AbilityContext, targetResults: RingTargetResults): void {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let buttons: PromptButton[] = [];
        let waitingPromptTitle = '';
        if(context.stage === Stages.PreTarget) {
            if(!targetResults.noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
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
        context.game.promptForRingSelect(player, Object.assign({}, promptProperties, this.properties));
    }

    checkTarget(context: AbilityContext): boolean {
        let selected = context.rings[this.name];
        if(!selected || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.properties.optional && Array.isArray(selected) && selected.length === 0 ||
            this.properties.ringCondition(selected as Ring, context);
    }

    getChoosingPlayer(context: AbilityContext): Player {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? (context.player.opponent as Player) : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}

export default AbilityTargetRing;
