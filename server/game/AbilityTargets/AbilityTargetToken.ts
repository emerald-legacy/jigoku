import CardSelector from '../CardSelector.js';
import { CardType, Stage, Players, Location } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type { StatusToken } from '../StatusToken.js';
import type { GameAction } from '../GameActions/GameAction.js';

type CardSelectorInstance = ReturnType<typeof CardSelector.for>;

interface OwningAbility {
    targets: { name: string }[];
}

interface AbilityTargetTokenProperties {
    gameAction: GameAction[];
    location?: Location | Location[];
    cardType?: CardType | CardType[];
    singleToken?: boolean;
    tokenCondition?: (token: StatusToken, context: AbilityContext) => boolean;
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
    [key: string]: unknown;
}

interface TokenTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTargetToken | null;
    costsFirst?: boolean;
}

interface PromptButton {
    text: string;
    arg: string;
    [key: string]: unknown;
}

class AbilityTargetToken {
    name: string;
    properties: AbilityTargetTokenProperties;
    selector: CardSelectorInstance;
    dependentTarget: AbilityTargetToken | null;
    dependentCost: { canPay(context: AbilityContext): boolean } | null;

    constructor(name: string, properties: AbilityTargetTokenProperties, ability: OwningAbility) {
        this.name = name;
        this.properties = properties;
        this.properties.location = this.properties.location || Location.PlayArea;
        this.selector = this.getSelector(properties);
        this.properties.singleToken = this.properties.singleToken || true;
        for(let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context: AbilityContext) => context.tokens[name]);
        }
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            if(dependsOnTarget) {
                (dependsOnTarget as AbilityTargetToken).dependentTarget = this;
            }
        }
    }

    getSelector(properties: AbilityTargetTokenProperties): CardSelectorInstance {
        let cardCondition = (card: BaseCard, context: AbilityContext) => {
            let tokens: StatusToken[] = [...card.statusTokens];
            if(!tokens || tokens.length === 0) {
                return false;
            }
            let contextCopy = context.copy({});
            contextCopy.tokens[this.name] = tokens;
            if(this.name === 'target') {
                contextCopy.token = tokens;
            }
            if(context.stage === Stage.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }

            let tokensValid = true;
            let tokenCondition = properties.tokenCondition;
            if(tokenCondition) {
                tokensValid = tokensValid && tokens.some((a: StatusToken) => tokenCondition(a, context));
            }
            let cardValid = true;
            if(properties.cardCondition) {
                cardValid = cardValid && properties.cardCondition(card as DrawCard, context as AbilityContext<DrawCard>);
            }

            return (tokensValid && cardValid) && (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                    (properties.gameAction.length === 0 || properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy)));
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

    resolve(context: AbilityContext, targetResults: TokenTargetResults): void {
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
            onSelect: (player: Player, card: BaseCard | BaseCard[]) => {
                if(!card || (Array.isArray(card) && card.length === 0)) {
                    return true;
                }

                const selectedCard = Array.isArray(card) ? card[0] : card;
                let validTokens: StatusToken[] = selectedCard.statusTokens.filter((token: StatusToken) => (!this.properties.tokenCondition || this.properties.tokenCondition(token, context)) && (this.properties.gameAction.length === 0 || this.properties.gameAction.some((action) => action.canAffect(token, context))));
                if(this.properties.singleToken && validTokens.length > 1) {
                    const choices = validTokens.map((token: StatusToken) => token.name);
                    const handlers = validTokens.map((token: StatusToken) => {
                        return () => {
                            let selected: StatusToken[] = [token];
                            context.tokens[this.name] = selected;
                            if(this.name === 'target') {
                                context.token = selected;
                            }
                        };
                    });
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Which token do you wish to select?',
                        choices: choices,
                        handlers: handlers,
                        context: context
                    });
                } else {
                    context.tokens[this.name] = validTokens;
                    if(this.name === 'target') {
                        context.token = validTokens;
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
        let selected = context.tokens[this.name];
        if(!selected || !Array.isArray(selected) || selected.length === 0 || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.selector.canTarget(selected[0].card as BaseCard, context);
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

export default AbilityTargetToken;
