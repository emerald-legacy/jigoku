import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { GameAction } from '../../GameActions/GameAction.js';
import type { StatusToken } from '../../StatusToken.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class PrepareForWar extends DrawCard {
    static id = 'prepare-for-war';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Remove honor token and any attachment',
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.multipleContext<DrawCard>((context) => {
                        const promptActions = this.getStatusTokenPrompts(context);
                        return {
                            gameActions: [
                                AbilityDsl.actions.selectCard<DrawCard>((context) => ({
                                    mode: TargetMode.Unlimited,
                                    cardType: CardType.Attachment,
                                    controller: Players.Any,
                                    cardCondition: (card) => card.parent === context.target,
                                    activePromptTitle: 'Choose any amount of attachments',
                                    optional: true,
                                    gameAction: AbilityDsl.actions.discardFromPlay(),
                                    message: '{0} chooses to discard {1} from {2}',
                                    messageArgs: (cards: DrawCard[]) => [
                                        context.player,
                                        cards.length === 0 ? 'no attachments' : cards,
                                        context.target ?? ''
                                    ]
                                })),
                                ...promptActions
                            ]
                        };
                    }),
                    AbilityDsl.actions.honor<DrawCard>((context) => ({
                        target: context.target?.hasTrait('commander') ? context.target : []
                    }))
                ])
            },
            effect: '{1}{2} {0}',
            effectArgs: (context) => {
                const target = context.target;
                if(!target) {
                    return ['', ''];
                }
                let isCommander = target.hasTrait('commander');
                let hasAttachments = target.attachments.length > 0;
                let hasToken = target.isDishonored || target.isHonored;
                let discardMessage = '';
                if(hasAttachments) {
                    discardMessage += 'choose to discard any number of attachments';
                    if(hasToken) {
                        discardMessage += ' or the status token from';
                    } else {
                        discardMessage += ' from';
                    }
                } else if(hasToken) {
                    discardMessage += 'choose to discard the status token from';
                }
                let honorMessage = '';
                if(isCommander) {
                    honorMessage = 'honor';
                    if(discardMessage.length > 0) {
                        honorMessage += ' and ';
                    }
                }
                return [honorMessage, discardMessage];
            }
        });
    }

    getStatusTokenPrompts(context: AbilityContext) {
        const tokens = (context.target as DrawCard).statusTokens;
        let prompts: GameAction[] = [];
        tokens.forEach((token: StatusToken) => {
            prompts.push(
                AbilityDsl.actions.menuPrompt((context) => ({
                    activePromptTitle: `Do you wish to discard ${token.name}?`,
                    choices: ['Yes', 'No'],
                    optional: true,
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage && choice === 'Yes') {
                            this.game.addMessage(
                                '{0} chooses to discard {1} from {2}',
                                context.player,
                                token,
                                context.target
                            );
                        }

                        return { target: choice === 'Yes' ? token : [] };
                    },
                    player: Players.Self,
                    gameAction: AbilityDsl.actions.discardStatusToken()
                }))
            );
        });

        return prompts;
    }
}


export default PrepareForWar;
