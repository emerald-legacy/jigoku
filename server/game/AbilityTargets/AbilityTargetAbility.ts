import { SelectorTargetBase, type SelectorTargetProperties } from './AbilityTargetBase.js';
import { CardSelector } from '../CardSelector.js';
import { Stage } from '../Constants.js';
import type { CardType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { CardAbility } from '../CardAbility.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { CardSelectorInstance } from './TargetPrompt.js';

interface AbilityTargetAbilityProperties extends SelectorTargetProperties {
    cardType?: CardType | CardType[];
    abilityCondition?: (ability: CardAbility) => boolean;
    printedOn?: boolean;
    cardCondition?(card: BaseCard, context: AbilityContext): boolean;
}

export class AbilityTargetAbility extends SelectorTargetBase<AbilityTargetAbilityProperties> {
    abilityCondition: (ability: CardAbility) => boolean;
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetAbilityProperties, ability: OwningAbility) {
        super(name, properties, ability);
        this.abilityCondition = properties.abilityCondition || (() => true);
        this.selector = this.getSelector(properties);
    }

    getSelector(properties: AbilityTargetAbilityProperties): CardSelectorInstance {
        const cardCondition = (card: BaseCard, context: AbilityContext) => this.legalAbilities(card, context).length > 0;
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: false }));
    }

    /** The abilities of `card` that can be chosen: their game actions have a legal target. */
    private legalAbilities(card: BaseCard, context: AbilityContext) {
        const abilities = (this.properties.printedOn
            ? [...card.abilities.actions, ...card.abilities.reactions].filter((ability) => ability.isPrintedAbility())
            : [...card.getCardActions(), ...card.getReactions()]
        ).filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
        return abilities.filter((ability) => {
            const contextCopy = context.copy({});
            contextCopy.targetAbility = ability;
            if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (!this.properties.cardCondition || this.properties.cardCondition(card, contextCopy)) &&
                   (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                   this.properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy));
        });
    }

    resolve(context: AbilityContext, targetResults: TargetResults): void {
        const player = this.chooserNow(context, targetResults);
        if(!player) {
            return;
        }
        const promptProperties = {
            ...this.targetPromptProperties(context, targetResults),
            selector: this.selector,
            onSelect: (player: Player, card: BaseCard | BaseCard[]) => {
                if(Array.isArray(card)) {
                    return true;
                }
                const abilities = this.legalAbilities(card, context);
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
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context: AbilityContext): boolean {
        if(!context.targetAbility || this.mustBeChosenAgain(context)) {
            return false;
        }
        return this.properties.cardType === context.targetAbility.card.type &&
               this.legalAbilities(context.targetAbility.card, context).some((ability) => ability === context.targetAbility);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.chosenByInitiatingPlayer(this.properties.gameAction, context);
    }
}

