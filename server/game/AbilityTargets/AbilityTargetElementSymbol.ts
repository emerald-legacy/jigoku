import { AbilityTargetBase } from './AbilityTargetBase.js';
import { CardSelector } from '../CardSelector.js';
import { CardType, Stage, Players, Location } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { OwningAbility, TargetResults } from '../BaseAbility.js';
import type { PromptButton } from '../PlayerPromptState.js';
import { type CardSelectorInstance, waitingPromptTitle } from './TargetPrompt.js';

interface AbilityTargetElementSymbolProperties {
    gameAction: GameAction[];
    location?: Location | Location[];
    cardType?: CardType | CardType[];
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

export class AbilityTargetElementSymbol extends AbilityTargetBase<AbilityTargetElementSymbolProperties> {
    selector: CardSelectorInstance;

    constructor(name: string, properties: AbilityTargetElementSymbolProperties, ability: OwningAbility) {
        super(name, properties, ability);
        this.properties.location = this.properties.location || Location.PlayArea;
        this.selector = this.getSelector(properties);
        for(const gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context: AbilityContext) => context.elements[name]);
        }
    }

    getSelector(properties: AbilityTargetElementSymbolProperties): CardSelectorInstance {
        const cardCondition = (card: BaseCard) => {
            if(!card.isInPlay()) {
                return false;
            }
            const elements = card.getCurrentElementSymbols();
            if(elements.length === 0) {
                return false;
            }
            return true; // only Twin Soul Temple uses this, and its action is valid whenever the card has an element
        };
        const cardType = properties.cardType || [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding, CardType.Province, CardType.Role, CardType.Stronghold];
        return CardSelector.for(Object.assign({}, properties, { cardType: cardType, cardCondition: cardCondition, targets: false }));
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
        if(!context.elementCard || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.selector.canTarget(context.elementCard, context);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}

