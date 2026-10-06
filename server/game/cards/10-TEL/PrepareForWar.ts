import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import {
    discardFromPlay,
    discardStatusToken,
    honor,
    menuPrompt,
    multipleContext,
    selectCards,
    sequential
} from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class PrepareForWar extends DrawCard {
    static id = 'prepare-for-war';

    setupCardAbilities() {
        this.action('Remove honor token and any attachment')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sequential([
                multipleContext((context) => {
                    const promptActions = this.getStatusTokenPrompts(context);
                    return {
                        gameActions: [
                            selectCards((context) => ({
                                mode: TargetMode.Unlimited,
                                cardType: CardType.Attachment,
                                controller: Players.Any,
                                cardCondition: (card) => card.parentCharacter === context.target,
                                activePromptTitle: 'Choose any amount of attachments',
                                optional: true,
                                gameAction: discardFromPlay(),
                                message: '{0} chooses to discard {1} from {2}',
                                messageArgs: (cards) => [
                                    context.player,
                                    cards.length === 0 ? 'no attachments' : cards,
                                    context.target ?? ''
                                ]
                            })),
                            ...promptActions
                        ]
                    };
                }),
                honor((context) => ({
                    target: context.target?.hasTrait('commander') ? context.target : []
                }))
            ]))
            .effect('{1}{2} {0}', (context) => {
                const target = context.target;
                const isCommander = target.hasTrait('commander');
                const hasAttachments = target.attachments.length > 0;
                const hasToken = target.isDishonored || target.isHonored;
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
            });
    }

    private getStatusTokenPrompts(context: AbilityContext) {
        return (context.target?.statusTokens ?? []).map((token) =>
            menuPrompt((context) => ({
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
                gameAction: discardStatusToken()
            }))
        );
    }
}


export default PrepareForWar;
