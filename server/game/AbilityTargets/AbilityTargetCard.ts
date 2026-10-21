import { AbilityTargetBase } from './AbilityTargetBase.js';
import { CardSelector } from '../CardSelector.js';
import { Stage, type Players, EffectName, Location, TargetMode, RestrictionType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { ActionOverrides, GameAction, HeldAction } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { CardSelectorInstance } from './TargetPrompt.js';
import { randomItem } from '../utils/random.js';

interface AbilityTargetCardProperties {
    gameAction: GameAction[];
    dependsOn?: string;
    mode?: TargetMode;
    optional?: boolean;
    skipIf?: (context: AbilityContext) => boolean;
    cardCondition?(card: BaseCard, context: AbilityContext): boolean;
    player?: ((context: AbilityContext) => Players) | Players;
}

export class AbilityTargetCard extends AbilityTargetBase<AbilityTargetCardProperties> {
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetCardProperties, ability: OwningAbility) {
        super(name, properties, ability);
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
                   (properties.gameAction.length === 0 || properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy, this.actionOverrides(contextCopy))));
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: true }));
    }

    /** A target with `skipIf` that is skipped now: nothing is chosen. */
    isSkipped(context: AbilityContext): boolean {
        return !!this.properties.skipIf?.(context);
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
        return this.isSkipped(context) || this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context: AbilityContext): HeldAction[] {
        return this.heldActions(this.properties.gameAction, context);
    }

    protected override actionOverrides(context: AbilityContext): ActionOverrides {
        return { target: context.targets[this.name] };
    }

    getAllLegalTargets(context: AbilityContext): BaseCard[] {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    resolve(context: AbilityContext, targetResults: TargetResults): void {
        if(this.isSkipped(context)) {
            context.targets[this.name] = [];
            return;
        }
        const chooser = this.chooserNow(context, targetResults);
        if(!chooser) {
            return;
        }
        const { player } = chooser;
        const hidden = player === context.choosingPlayerOverride ? this.cardsHiddenFrom(player, context) : [];
        if(hidden.length > 0) {
            // Hantei XXXVIII doesn't see the hand: a random card, or none if it needs certain traits (ruling #926)
            const card = this.properties.cardCondition ? undefined : randomItem(hidden);
            context.targets[this.name] = card ?? [];
            if(this.name === 'target') {
                context.target = card;
            }
            return;
        }
        const { cardCondition: _cardCondition, player: _playerProp, skipIf: _skipIf, ...otherProperties } = this.properties;

        const mustSelect = this.selector.getAllLegalTargets(context, player).filter((card: BaseCard) =>
            card.getEffects(EffectName.MustBeChosen).some((restriction) => restriction.isMatch(RestrictionType.Target, context))
        );
        const promptProperties = {
            ...this.targetPromptProperties(context, targetResults),
            selector: this.selector,
            mustSelect: mustSelect,
            onSelect: (_player: Player, card: BaseCard | BaseCard[]) => {
                context.targets[this.name] = card;
                if(this.name === 'target') {
                    context.target = Array.isArray(card) ? undefined : card;
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

    /** For a choice taken over (Hantei XXXVIII): the legal targets, when all are in a hand `player` can't see. */
    private cardsHiddenFrom(player: Player | undefined, context: AbilityContext): BaseCard[] {
        if(!player || player === this.getChoosingPlayer(context)) {
            return [];
        }
        const cards = this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
        return cards.every((card) => card.location === Location.Hand && card.controller !== player) ? cards : [];
    }

    /** Whether the opponent could choose blindly: a random card, or none where one must be chosen ("up to" can't choose none, ruling #1010). */
    private canChooseBlindly(context: AbilityContext): boolean {
        const upTo = [TargetMode.UpTo, TargetMode.UpToVariable, TargetMode.MaxStat, TargetMode.Unlimited].includes(this.properties.mode ?? TargetMode.Single);
        return this.cardsHiddenFrom(context.player.opponent, context).length > 0 && (!this.properties.cardCondition || !upTo);
    }

    checkTarget(context: AbilityContext): boolean {
        if(this.isSkipped(context)) {
            return true;
        }
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
        if(this.getChoosingPlayer(context) === context.player && (this.selector.optional || this.selector.hasEnoughTargets(context, context.player.opponent) || this.canChooseBlindly(context))) {
            return true;
        }
        return !this.properties.dependsOn && this.checkGameActionsForTargetsChosenByInitiatingPlayer(context);
    }

    checkGameActionsForTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.getAllLegalTargets(context).some((card) => {
            const contextCopy = this.getContextCopy(card, context);
            if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(contextCopy, this.actionOverrides(contextCopy)))) {
                return true;
            } else if(this.dependentTarget) {
                // only a card target looks further down the chain
                return this.dependentTarget.checkGameActionsForTargetsChosenByInitiatingPlayer?.(contextCopy) ?? false;
            }
            return false;
        });
    }
}

