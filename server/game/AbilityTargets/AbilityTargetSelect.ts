import { SelectChoice } from './SelectChoice.js';
import { Stage, Players } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { ChoicesInterface } from '../Interfaces.js';

type ChoiceValue = ((context: AbilityContext) => boolean) | GameAction | GameAction[];

interface OwningAbility {
    targets: { name: string }[];
}

interface AbilityTargetSelectProperties {
    choices: ChoicesInterface | ((context: AbilityContext) => ChoicesInterface);
    condition?: (context: AbilityContext) => boolean;
    targets?: boolean;
    activePromptTitle?: string;
    source?: unknown;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
    [key: string]: unknown;
}

interface SelectTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTargetSelect | null;
    noCostsFirstButton?: boolean;
}

class AbilityTargetSelect {
    name: string;
    properties: AbilityTargetSelectProperties;
    dependentTarget: AbilityTargetSelect | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetSelectProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                (dependsOnTarget as AbilityTargetSelect).dependentTarget = this;
            }
        }
    }

    canResolve(context: AbilityContext): boolean {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context: AbilityContext): boolean {
        let keys = Object.keys(this.getChoices(context));
        return keys.some((key) => this.isChoiceLegal(key, context));
    }

    getChoices(context: AbilityContext): ChoicesInterface {
        if(typeof this.properties.choices === 'function') {
            return this.properties.choices(context);
        }
        return this.properties.choices;
    }

    isChoiceLegal(key: string, context: AbilityContext): boolean {
        let contextCopy = context.copy({});
        contextCopy.selects[this.name] = new SelectChoice(key);
        if(this.name === 'target') {
            contextCopy.select = key;
        }
        if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
            return false;
        }
        if(this.dependentTarget && !this.dependentTarget.hasLegalTarget(contextCopy)) {
            return false;
        }
        let choice: ChoiceValue = this.getChoices(context)[key];
        if(typeof choice === 'function') {
            return choice(contextCopy);
        }
        return (choice as GameAction).hasLegalTarget(contextCopy);
    }

    getGameAction(context: AbilityContext): GameAction[] {
        if(!context.selects[this.name]) {
            return [];
        }
        let choice: any = this.getChoices(context)[context.selects[this.name].choice];
        if(typeof choice !== 'function') {
            return choice;
        }
        return [];
    }

    getAllLegalTargets(context: AbilityContext): string[] {
        return Object.keys(this.getChoices(context)).filter((key) => this.isChoiceLegal(key, context));
    }

    resolve(context: AbilityContext, targetResults: SelectTargetResults): void {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        if(this.properties.condition && !this.properties.condition(context)) {
            return;
        }

        let player = (this.properties.targets && context.choosingPlayerOverride) || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stage.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices: string[] = Object.keys(this.getChoices(context)).filter((key) => this.isChoiceLegal(key, context));
        let handlers: (() => void)[] = choices.map((choice) => {
            return () => {
                context.selects[this.name] = new SelectChoice(choice);
                if(this.name === 'target') {
                    context.select = choice;
                }
            };
        });
        if(player !== context.player.opponent && context.stage === Stage.PreTarget) {
            if(!targetResults.noCostsFirstButton) {
                choices.push('Pay costs first');
                handlers.push(() => (targetResults.payCostsFirst = true));
            }
            choices.push('Cancel');
            handlers.push(() => (targetResults.cancelled = true));
        }
        if(handlers.length === 1) {
            handlers[0]();
        } else if(handlers.length > 1) {
            let waitingPromptTitle = '';
            if(context.stage === Stage.PreTarget) {
                if(context.ability.abilityType === 'action') {
                    waitingPromptTitle = 'Waiting for opponent to take an action or pass';
                } else {
                    waitingPromptTitle = 'Waiting for opponent';
                }
            }
            context.game.promptWithHandlerMenu(player, {
                waitingPromptTitle: waitingPromptTitle,
                activePromptTitle: promptTitle,
                context: context,
                source: this.properties.source || context.source,
                choices: choices,
                handlers: handlers
            });
        }
    }

    checkTarget(context: AbilityContext): boolean {
        if(
            this.properties.targets &&
            context.choosingPlayerOverride &&
            this.getChoosingPlayer(context) === context.player
        ) {
            return false;
        }
        return !!context.selects[this.name] && this.isChoiceLegal(context.selects[this.name].choice, context);
    }

    getChoosingPlayer(context: AbilityContext): Player {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? (context.player.opponent as Player) : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.properties.targets) {
            return true;
        }
        let actions = Object.values(this.getChoices(context)).filter((value) => typeof value !== 'function');
        return actions.some((action) => (action as GameAction).hasTargetsChosenByInitiatingPlayer(context));
    }
}

export default AbilityTargetSelect;
