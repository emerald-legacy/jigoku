import CardSelector from '../CardSelector.js';
import { Stages, Players } from '../Constants.js';
import type { CardTypes } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type CardAbility from '../CardAbility.js';
import type { GameAction } from '../GameActions/GameAction.js';

type CardSelectorInstance = ReturnType<typeof CardSelector.for>;

interface OwningAbility {
    targets: { name: string }[];
}

interface AbilityTargetAbilityProperties {
    gameAction: GameAction[];
    cardType?: CardTypes | CardTypes[];
    abilityCondition?: (ability: CardAbility) => boolean;
    cardCondition?: (card: BaseCard, context: AbilityContext) => boolean;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
    [key: string]: unknown;
}

interface AbilityTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTargetAbility | null;
    costsFirst?: boolean;
}

interface PromptButton {
    text: string;
    arg: string;
}

class AbilityTargetAbility {
    name: string;
    properties: AbilityTargetAbilityProperties;
    abilityCondition: (ability: CardAbility) => boolean;
    selector: CardSelectorInstance;
    dependentTarget: AbilityTargetAbility | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetAbilityProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        this.abilityCondition = properties.abilityCondition || (() => true);
        this.selector = this.getSelector(properties);
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                (dependsOnTarget as AbilityTargetAbility).dependentTarget = this;
            }
        }
    }

    getSelector(properties: AbilityTargetAbilityProperties): CardSelectorInstance {
        let cardCondition = (card: BaseCard, context: AbilityContext) => {
            let abilities = (card.actions as CardAbility[]).concat(card.reactions).filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
            return abilities.some((ability) => {
                let contextCopy = context.copy({});
                contextCopy.targetAbility = ability;
                if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                    return false;
                }
                return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                       (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                       properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy));
            });
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: false }));
    }

    canResolve(context: AbilityContext): boolean {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context: AbilityContext): boolean {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getAllLegalTargets(context: AbilityContext): BaseCard[] {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context: AbilityContext): GameAction[] {
        return this.properties.gameAction.filter((gameAction) => gameAction.hasLegalTarget(context));
    }

    resolve(context: AbilityContext, targetResults: AbilityTargetResults): void {
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
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            context: context,
            selector: this.selector,
            onSelect: (player: Player, card: BaseCard) => {
                let abilities = (card.actions as CardAbility[]).concat(card.reactions).filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
                if(abilities.length === 1) {
                    context.targetAbility = abilities[0];
                } else if(abilities.length > 1) {
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Choose an ability',
                        context: context,
                        choices: abilities.map((ability) => ability.title).concat('Back'),
                        choiceHandler: (choice: string) => {
                            if(choice === 'Back') {
                                context.game.queueSimpleStep(() => this.resolve(context, targetResults));
                            } else {
                                context.targetAbility = abilities.find((ability) => ability.title === choice) as CardAbility;
                            }
                        }
                    });
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (_player: Player, arg: string) => {
                if(arg === 'costsFirst') {
                    targetResults.costsFirst = true;
                    return true;
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context: AbilityContext): boolean {
        if(!context.targetAbility || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.properties.cardType === context.targetAbility.card.type &&
               (!this.properties.cardCondition || this.properties.cardCondition(context.targetAbility.card, context)) &&
               this.abilityCondition(context.targetAbility);
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

export default AbilityTargetAbility;
