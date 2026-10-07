import { AbilityTargetBase } from './AbilityTargetBase.js';
import CardSelector from '../CardSelector.js';
import { Stage, Players } from '../Constants.js';
import type { CardType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type CardAbility from '../CardAbility.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { PromptButton } from '../PlayerPromptState.js';
import { type CardSelectorInstance, waitingPromptTitle } from './TargetPrompt.js';

interface AbilityTargetAbilityProperties {
    gameAction: GameAction[];
    cardType?: CardType | CardType[];
    abilityCondition?: (ability: CardAbility) => boolean;
    cardCondition?(card: BaseCard, context: AbilityContext): boolean;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

class AbilityTargetAbility extends AbilityTargetBase<AbilityTargetAbilityProperties> {
    abilityCondition: (ability: CardAbility) => boolean;
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetAbilityProperties, ability: OwningAbility) {
        super(name, properties, ability);
        this.abilityCondition = properties.abilityCondition || (() => true);
        this.selector = this.getSelector(properties);
    }

    getSelector(properties: AbilityTargetAbilityProperties): CardSelectorInstance {
        const cardCondition = (card: BaseCard, context: AbilityContext) => {
            const abilities = [...card.actions, ...card.reactions].filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
            return abilities.some((ability) => {
                const contextCopy = context.copy({});
                contextCopy.targetAbility = ability;
                if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                    return false;
                }
                return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                       (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                       properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy));
            });
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: false }));
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

    resolve(context: AbilityContext, targetResults: TargetResults): void {
        const chooser = this.chooserNow(context, targetResults);
        if(!chooser) {
            return;
        }
        const { player } = chooser;
        const buttons: PromptButton[] = [];
        if(context.stage === Stage.PreTarget) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        const promptProperties = {
            waitingPromptTitle: context.stage === Stage.PreTarget ? waitingPromptTitle(context) : '',
            buttons: buttons,
            context: context,
            selector: this.selector,
            onSelect: (player: Player, card: BaseCard | BaseCard[]) => {
                if(Array.isArray(card)) {
                    return true;
                }
                const abilities = [...card.actions, ...card.reactions].filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
                if(abilities.length === 1) {
                    context.targetAbility = abilities[0];
                } else if(abilities.length > 1) {
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Choose an ability',
                        context: context,
                        choices: abilities.map((ability) => ability.title).concat('Back'),
                        choiceHandler: (choice) => {
                            if(choice === 'Back') {
                                context.game.queueSimpleStep(() => this.resolve(context, targetResults));
                            } else {
                                context.targetAbility = abilities.find((ability) => ability.title === choice);
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
            onMenuCommand: () => true
        };
        if(!player) {
            // a solo game has no opponent to choose
            return;
        }
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

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}

export default AbilityTargetAbility;
