import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import {
    discardFromPlay,
    discardStatusToken,
    honor,
    optional,
    multiple,
    selectCards,
    sequential
} from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode, Trait } from '../../Constants.js';

class PrepareForWar extends DrawCard {
    static id = 'prepare-for-war';

    override setupCardAbilities() {
        this.action('Remove honor token and any attachment')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sequential([
                multiple((context) => {
                    const promptActions = this.getStatusTokenPrompts(context);
                    return [
                        selectCards((context) => ({
                            mode: TargetMode.Unlimited,
                            cardType: CardType.Attachment,
                            controller: Players.Any,
                            cardCondition: (card) => card.parentCharacter === context.target,
                            activePromptTitle: 'Choose any amount of attachments',
                            optional: true,
                            gameAction: discardFromPlay(),
                            message: (context, cards) => msg`${context.player} chooses to discard ${cards.length === 0 ? 'no attachments' : cards} from ${context.target ?? ''}`
                        })),
                        ...promptActions
                    ];
                }),
                honor((context) => ({
                    target: context.target?.hasTrait(Trait.Commander) ? context.target : []
                }))
            ]))
            .chatText((context) => {
                const target = context.target;
                const isCommander = target.hasTrait(Trait.Commander);
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
                return msg`${honorMessage}${discardMessage} ${context.chatTarget()}`;
            });
    }

    private getStatusTokenPrompts(context: AbilityContext) {
        return (context.target?.statusTokens ?? []).map((token) =>
            optional((context) => ({
                activePromptTitle: `Do you wish to discard ${token.name}?`,
                optional: true,
                gameAction: discardStatusToken({ target: token }),
                acceptMessage: () => msg`${context.player} chooses to discard ${token} from ${context.target}`
            }))
        );
    }
}


export default PrepareForWar;
