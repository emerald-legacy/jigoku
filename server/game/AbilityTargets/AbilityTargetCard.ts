import CardSelector from '../CardSelector.js';
import { Stages, Players, EffectNames, TargetModes } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';

type CardSelectorInstance = ReturnType<typeof CardSelector.for>;

interface OwningAbility {
    targets: { name: string }[];
}

interface AbilityTargetCardProperties {
    gameAction: GameAction[];
    dependsOn?: string;
    mode?: TargetModes;
    cardCondition?: (card: any, context: AbilityContext) => boolean;
    player?: ((context: AbilityContext) => Players) | Players;
    [key: string]: unknown;
}

interface CardTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTargetCard | null;
    noCostsFirstButton?: boolean;
}

interface PromptButton {
    text: string;
    arg: string;
}

class AbilityTargetCard {
    name: string;
    properties: AbilityTargetCardProperties;
    selector: CardSelectorInstance;
    dependentTarget: AbilityTargetCard | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetCardProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        for(let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context: AbilityContext) => context.targets[name]);
        }
        this.selector = this.getSelector(properties);
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                (dependsOnTarget as AbilityTargetCard).dependentTarget = this;
            }
        }
    }

    getSelector(properties: AbilityTargetCardProperties): CardSelectorInstance {
        let cardCondition = (card: BaseCard, context: AbilityContext) => {
            let contextCopy = this.getContextCopy(card, context);
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                   (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                   (properties.gameAction.length === 0 || properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy)));
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: true }));
    }

    getContextCopy(card: BaseCard, context: AbilityContext): AbilityContext {
        let contextCopy = context.copy({});
        contextCopy.targets[this.name] = card;
        if(this.name === 'target') {
            contextCopy.target = card;
        }
        return contextCopy;
    }

    canResolve(context: AbilityContext): boolean {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context: AbilityContext): boolean {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context: AbilityContext): GameAction[] {
        return this.properties.gameAction.filter((gameAction) => gameAction.hasLegalTarget(context));
    }

    getAllLegalTargets(context: AbilityContext): BaseCard[] {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    resolve(context: AbilityContext, targetResults: CardTargetResults): void {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        if(this.properties.mode === TargetModes.AutoSingle) {
            let legalTargets = this.selector.getAllLegalTargets(context, player);
            if(legalTargets.length === 1) {
                context.targets[this.name] = legalTargets[0];
                return;
            }
        }
        let { cardCondition: _cardCondition, player: _playerProp, ...otherProperties } = this.properties;

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
        let mustSelect = this.selector.getAllLegalTargets(context, player).filter((card: BaseCard) =>
            card.getEffects(EffectNames.MustBeChosen).some((restriction) => restriction.isMatch('target', context))
        );
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            mustSelect: mustSelect,
            onSelect: (_player: Player, card: BaseCard) => {
                context.targets[this.name] = card;
                if(this.name === 'target') {
                    context.target = card;
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
        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
    }

    checkTarget(context: AbilityContext): boolean {
        if(!context.targets[this.name]) {
            return false;
        } else if(context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        let slot = context.targets[this.name];
        let cards: BaseCard[] = Array.isArray(slot) ? slot : [slot];
        return (cards.every((card) => this.selector.canTarget(card, context, context.choosingPlayerOverride || this.getChoosingPlayer(context))) &&
                this.selector.hasEnoughSelected(cards, context) && !this.selector.hasExceededLimit(cards, context));
    }

    getChoosingPlayer(context: AbilityContext): Player {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? (context.player.opponent as Player) : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.getChoosingPlayer(context) === context.player && (this.selector.optional || this.selector.hasEnoughTargets(context, context.player.opponent as Player))) {
            return true;
        }
        return !this.properties.dependsOn && this.checkGameActionsForTargetsChosenByInitiatingPlayer(context);
    }

    checkGameActionsForTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.getAllLegalTargets(context).some((card) => {
            let contextCopy = this.getContextCopy(card, context);
            if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(contextCopy))) {
                return true;
            } else if(this.dependentTarget) {
                return this.dependentTarget.checkGameActionsForTargetsChosenByInitiatingPlayer(contextCopy);
            }
            return false;
        });
    }
}

export default AbilityTargetCard;
