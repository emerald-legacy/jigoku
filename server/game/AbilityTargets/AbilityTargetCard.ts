import { AbilityTargetBase } from './AbilityTargetBase.js';
import CardSelector from '../CardSelector.js';
import { Stage, Players, EffectName, TargetMode } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { PromptButton } from '../PlayerPromptState.js';
import { type CardSelectorInstance, waitingPromptTitle } from './TargetPrompt.js';

interface AbilityTargetCardProperties {
    gameAction: GameAction[];
    dependsOn?: string;
    mode?: TargetMode;
    cardCondition?(card: BaseCard, context: AbilityContext): boolean;
    player?: ((context: AbilityContext) => Players) | Players;
}

class AbilityTargetCard extends AbilityTargetBase<AbilityTargetCardProperties> {
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetCardProperties, ability: OwningAbility) {
        super(name, properties, ability);
        for(const gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context: AbilityContext) => context.targets[name]);
        }
        this.selector = this.getSelector(properties);
    }

    getSelector(properties: AbilityTargetCardProperties): CardSelectorInstance {
        const cardCondition = (card: BaseCard, context: AbilityContext) => {
            const contextCopy = this.getContextCopy(card, context);
            if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                   (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                   (properties.gameAction.length === 0 || properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy)));
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: true }));
    }

    getContextCopy(card: BaseCard, context: AbilityContext): AbilityContext {
        const contextCopy = context.copy({});
        contextCopy.targets[this.name] = card;
        if(this.name === 'target') {
            contextCopy.target = card;
        }
        return contextCopy;
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

    resolve(context: AbilityContext, targetResults: TargetResults): void {
        const chooser = this.chooserNow(context, targetResults);
        if(!chooser) {
            return;
        }
        const { player } = chooser;
        const { cardCondition: _cardCondition, player: _playerProp, ...otherProperties } = this.properties;

        const buttons: PromptButton[] = [];
        if(context.stage === Stage.PreTarget) {
            buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        const mustSelect = this.selector.getAllLegalTargets(context, player).filter((card: BaseCard) =>
            card.getEffects(EffectName.MustBeChosen).some((restriction) => restriction.isMatch('target', context))
        );
        const promptProperties = {
            waitingPromptTitle: context.stage === Stage.PreTarget ? waitingPromptTitle(context) : '',
            context: context,
            selector: this.selector,
            buttons: buttons,
            mustSelect: mustSelect,
            onSelect: (_player: Player, card: BaseCard | BaseCard[]) => {
                context.targets[this.name] = card;
                if(this.name === 'target') {
                    context.target = Array.isArray(card) ? undefined : card;
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
        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
    }

    checkTarget(context: AbilityContext): boolean {
        if(!context.targets[this.name]) {
            return false;
        } else if(context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        const slot = context.targets[this.name];
        const cards: BaseCard[] = Array.isArray(slot) ? slot : [slot];
        return (cards.every((card) => this.selector.canTarget(card, context, context.choosingPlayerOverride || this.getChoosingPlayer(context))) &&
                this.selector.hasEnoughSelected(cards, context) && !this.selector.hasExceededLimit(cards, context));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.getChoosingPlayer(context) === context.player && (this.selector.optional || this.selector.hasEnoughTargets(context, context.player.opponent))) {
            return true;
        }
        return !this.properties.dependsOn && this.checkGameActionsForTargetsChosenByInitiatingPlayer(context);
    }

    checkGameActionsForTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.getAllLegalTargets(context).some((card) => {
            const contextCopy = this.getContextCopy(card, context);
            if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(contextCopy))) {
                return true;
            } else if(this.dependentTarget) {
                // only a card target looks further down the chain
                return this.dependentTarget.checkGameActionsForTargetsChosenByInitiatingPlayer?.(contextCopy) ?? false;
            }
            return false;
        });
    }
}

export default AbilityTargetCard;
