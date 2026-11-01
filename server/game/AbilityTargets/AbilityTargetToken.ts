import { SelectorTargetBase, type SelectorTargetProperties } from './AbilityTargetBase.js';
import { CardSelector } from '../CardSelector.js';
import { type CardType, Stage, Location, ALL_CARD_TYPES } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { StatusToken } from '../StatusToken.js';
import type { ActionOverrides } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { CardSelectorInstance } from './TargetPrompt.js';

interface AbilityTargetTokenProperties extends SelectorTargetProperties {
    location?: Location | Location[];
    cardType?: CardType | CardType[];
    tokenCondition?: (token: StatusToken, context: AbilityContext) => boolean;
    cardCondition?(card: BaseCard, context: AbilityContext): boolean;
}

export class AbilityTargetToken extends SelectorTargetBase<AbilityTargetTokenProperties> {
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetTokenProperties, ability: OwningAbility) {
        super(name, properties, ability);
        this.properties.location = this.properties.location || Location.PlayArea;
        this.selector = this.getSelector(properties);
    }

    getSelector(properties: AbilityTargetTokenProperties): CardSelectorInstance {
        const cardCondition = (card: BaseCard, context: AbilityContext) => {
            if(properties.cardCondition && !properties.cardCondition(card, context)) {
                return false;
            }
            return card.statusTokens.some((token) => this.isTokenLegal(token, context));
        };
        const cardType = properties.cardType || [...ALL_CARD_TYPES];
        return CardSelector.for(Object.assign({}, properties, { cardType: cardType, cardCondition: cardCondition, targets: false }));
    }

    /** Whether choosing this one token leaves a legal choice for the dependent target and the game actions. */
    private isTokenLegal(token: StatusToken, context: AbilityContext): boolean {
        if(this.properties.tokenCondition && !this.properties.tokenCondition(token, context)) {
            return false;
        }
        const contextCopy = context.copy({});
        contextCopy.tokens[this.name] = [token];
        if(this.name === 'target') {
            contextCopy.token = [token];
        }
        if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
            return false;
        }
        return (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
            (this.properties.gameAction.length === 0 || this.properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy, this.actionOverrides(contextCopy))));
    }

    protected override actionOverrides(context: AbilityContext): ActionOverrides {
        return { target: context.tokens[this.name] };
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
                if(!card || (Array.isArray(card) && card.length === 0)) {
                    return true;
                }

                const selectedCard = Array.isArray(card) ? card[0] : card;
                const validTokens: StatusToken[] = selectedCard.statusTokens.filter((token: StatusToken) => this.isTokenLegal(token, context));
                if(validTokens.length > 1) {
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Which token do you wish to select?',
                        options: validTokens.map((token: StatusToken) => ({
                            text: token.name,
                            handler: () => {
                                const selected: StatusToken[] = [token];
                                context.tokens[this.name] = selected;
                                if(this.name === 'target') {
                                    context.token = selected;
                                }
                            }
                        })),
                        context: context
                    });
                } else {
                    context.tokens[this.name] = validTokens;
                    if(this.name === 'target') {
                        context.token = validTokens;
                    }
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context: AbilityContext): boolean {
        const selected = context.tokens[this.name];
        if(!selected || !Array.isArray(selected) || selected.length === 0 || this.mustBeChosenAgain(context)) {
            return false;
        }
        const card = selected[0].card;
        return !!card && this.selector.canTarget(card, context);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.chosenByInitiatingPlayer(this.properties.gameAction, context);
    }
}

