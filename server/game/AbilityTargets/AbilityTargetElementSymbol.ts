import CardSelector from '../CardSelector.js';
import { CardType, Stage, Players, Location } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';

type CardSelectorInstance = ReturnType<typeof CardSelector.for>;

interface OwningAbility {
    targets: { name: string }[];
}

interface AbilityTargetElementSymbolProperties {
    gameAction: GameAction[];
    location?: Location | Location[];
    cardType?: CardType | CardType[];
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
    [key: string]: unknown;
}

interface ElementTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTargetElementSymbol | null;
    costsFirst?: boolean;
}

interface PromptButton {
    text: string;
    arg: string;
    [key: string]: unknown;
}

class AbilityTargetElementSymbol {
    name: string;
    properties: AbilityTargetElementSymbolProperties;
    selector: CardSelectorInstance;
    dependentTarget: AbilityTargetElementSymbol | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetElementSymbolProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        this.properties.location = this.properties.location || Location.PlayArea;
        this.selector = this.getSelector(properties);
        for(let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context: AbilityContext) => context.elements[name]);
        }
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                (dependsOnTarget as AbilityTargetElementSymbol).dependentTarget = this;
            }
        }
    }

    getSelector(properties: AbilityTargetElementSymbolProperties): CardSelectorInstance {
        let cardCondition = (card: BaseCard) => {
            if(!card.isInPlay()) {
                return false;
            }
            let elements = card.getCurrentElementSymbols();
            if(elements.length === 0) {
                return false;
            }
            return true; // cheating, this is only used for Twin Soul Temple and the action is always valid if it has an element

            // let contextCopy = context.copy();
            // contextCopy.elements[this.name] = elements;
            // if(this.name === 'target') {
            //     contextCopy.element = elements;
            // }
            // if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
            //     return false;
            // }

            // return (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
            //         (properties.gameAction.length === 0 || properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy)));
        };
        let cardType = properties.cardType || [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding, CardType.Province, CardType.Role, CardType.Stronghold];
        return CardSelector.for(Object.assign({}, properties, { cardType: cardType, cardCondition: cardCondition, targets: false }));
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

    resolve(context: AbilityContext, targetResults: ElementTargetResults): void {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stage.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let buttons: PromptButton[] = [];
        let waitingPromptTitle = '';
        if(context.stage === Stage.PreTarget) {
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
                let validElements = card.getCurrentElementSymbols();
                context.elementCard = card;
                if(validElements.length > 1) {
                    const choices = validElements.map((element) => `${element.prettyName} (${element.element})`);
                    const handlers = validElements.map((element) => {
                        return () => {
                            context.elements[this.name] = element;
                            if(this.name === 'target') {
                                context.element = element;
                            }
                        };
                    });
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Which element do you wish to select?',
                        choices: choices,
                        handlers: handlers,
                        context: context
                    });
                } else {
                    context.elements[this.name] = validElements[0];
                    if(this.name === 'target') {
                        context.element = validElements[0];
                    }
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
        if(!context.elementCard || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.selector.canTarget(context.elementCard, context);
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

export default AbilityTargetElementSymbol;
