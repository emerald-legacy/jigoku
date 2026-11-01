import { SelectorTargetBase, type SelectorTargetProperties } from './AbilityTargetBase.js';
import { CardSelector } from '../CardSelector.js';
import { type CardType, Location, ALL_CARD_TYPES } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { ActionOverrides } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { CardSelectorInstance } from './TargetPrompt.js';

interface AbilityTargetElementSymbolProperties extends SelectorTargetProperties {
    location?: Location | Location[];
    cardType?: CardType | CardType[];
}

export class AbilityTargetElementSymbol extends SelectorTargetBase<AbilityTargetElementSymbolProperties> {
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetElementSymbolProperties, ability: OwningAbility) {
        super(name, properties, ability);
        this.properties.location = this.properties.location || Location.PlayArea;
        this.selector = this.getSelector(properties);
    }

    getSelector(properties: AbilityTargetElementSymbolProperties): CardSelectorInstance {
        // only Twin Soul Temple uses this, and its action is valid whenever the card has an element
        const cardCondition = (card: BaseCard) => card.isInPlay() && card.getCurrentElementSymbols().length > 0;
        const cardType = properties.cardType || [...ALL_CARD_TYPES];
        return CardSelector.for(Object.assign({}, properties, { cardType: cardType, cardCondition: cardCondition, targets: false }));
    }

    protected override actionOverrides(context: AbilityContext): ActionOverrides {
        return { target: context.elements[this.name] };
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
                const validElements = card.getCurrentElementSymbols();
                context.elementCard = card;
                if(validElements.length > 1) {
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Which element do you wish to select?',
                        options: validElements.map((element) => ({
                            text: `${element.prettyName} (${element.element})`,
                            handler: () => {
                                context.elements[this.name] = element;
                                if(this.name === 'target') {
                                    context.element = element;
                                }
                            }
                        })),
                        context: context
                    });
                } else {
                    context.elements[this.name] = validElements[0];
                    if(this.name === 'target') {
                        context.element = validElements[0];
                    }
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context: AbilityContext): boolean {
        if(!context.elementCard || this.mustBeChosenAgain(context)) {
            return false;
        }
        return this.selector.canTarget(context.elementCard, context);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.chosenByInitiatingPlayer(this.properties.gameAction, context);
    }
}

