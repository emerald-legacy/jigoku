import { SelectChoice } from './SelectChoice.js';
import { Stage, Players } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { ChoicesInput, ChoicesInterface } from '../Interfaces.js';
import type EffectSource from '../EffectSource.js';
import type { HandlerMenuOption } from '../gamesteps/HandlerMenuPrompt.js';
import type { DependentTarget, OwningAbility } from '../BaseAbility.js';

type ChoiceValue = ((context: AbilityContext) => unknown) | GameAction | GameAction[];


interface AbilityTargetSelectProperties {
    choices: ChoicesInput | ((context: AbilityContext) => ChoicesInput);
    condition?: (context: AbilityContext) => boolean;
    targets?: boolean;
    activePromptTitle?: string;
    source?: EffectSource | string;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
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
    dependentTarget: DependentTarget | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetSelectProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            const dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                dependsOnTarget.dependentTarget = this;
            }
        }
    }

    canResolve(context: AbilityContext): boolean {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context: AbilityContext): boolean {
        const keys = Object.keys(this.getChoices(context));
        return keys.some((key) => this.isChoiceLegal(key, context));
    }

    getChoices(context: AbilityContext): ChoicesInterface {
        const input = typeof this.properties.choices === 'function' ? this.properties.choices(context) : this.properties.choices;
        const choices: ChoicesInterface = {};
        for(const [label, choice] of Object.entries(input)) {
            if(choice !== undefined) {
                choices[label] = choice;
            }
        }
        return choices;
    }

    isChoiceLegal(key: string, context: AbilityContext): boolean {
        const contextCopy = context.copy({});
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
        const choice: ChoiceValue = this.getChoices(context)[key];
        if(typeof choice === 'function') {
            return !!choice(contextCopy);
        }
        return (Array.isArray(choice) ? choice : [choice]).some((action) => action.hasLegalTarget(contextCopy));
    }

    getGameAction(context: AbilityContext): GameAction[] {
        if(!context.selects[this.name]) {
            return [];
        }
        const choice: ChoiceValue = this.getChoices(context)[context.selects[this.name].choice];
        if(typeof choice !== 'function') {
            return Array.isArray(choice) ? choice : [choice];
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

        const player = (this.properties.targets && context.choosingPlayerOverride) || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stage.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        const promptTitle = this.properties.activePromptTitle || 'Select one';
        const options: HandlerMenuOption[] = Object.keys(this.getChoices(context))
            .filter((key) => this.isChoiceLegal(key, context))
            .map((choice) => ({
                text: choice,
                handler: () => {
                    context.selects[this.name] = new SelectChoice(choice);
                    if(this.name === 'target') {
                        context.select = choice;
                    }
                }
            }));
        if(player !== context.player.opponent && context.stage === Stage.PreTarget) {
            if(!targetResults.noCostsFirstButton) {
                options.push({ text: 'Pay costs first', handler: () => (targetResults.payCostsFirst = true) });
            }
            options.push({ text: 'Cancel', handler: () => (targetResults.cancelled = true) });
        }
        if(options.length === 1) {
            options[0].handler();
        } else if(options.length > 1) {
            if(!player) {
                // a solo game has no opponent to choose
                return;
            }
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
                options
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

    getChoosingPlayer(context: AbilityContext): Player | undefined {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.properties.targets) {
            return true;
        }
        const actions = Object.values(this.getChoices(context)).flatMap((value: ChoiceValue) => typeof value === 'function' ? [] : value);
        return actions.some((action) => action.hasTargetsChosenByInitiatingPlayer(context));
    }
}

export default AbilityTargetSelect;
