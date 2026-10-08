import { bow, discardFromPlay, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const CHARACTER = 'CHARACTER';
const SELECT = 'SELECT';

export default class AkodoCho extends DrawCard {
    static id = 'akodo-cho';

    setupCardAbilities() {
        this.conflictAction('Bow a character')
            .condition((context) =>
                context.source.attachments.some((attachment) => attachment.hasTrait('follower')))
            .target({
                name: CHARACTER,
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) =>
                    card.isParticipating() && bow().canAffect(card, context)
            })
            .select({
                name: SELECT,
                dependsOn: CHARACTER,
                player: (context) =>
                    context.targets[CHARACTER].controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Discard an attachment from this character': selectCard((context) => ({
                    cardType: CardType.Attachment,
                    chatText: 'discard an attachment on {0}',
                    chatTextArgs: () => [context.targets[CHARACTER]],
                    player:
                                context.targets[CHARACTER].controller === context.player
                                    ? Players.Self
                                    : Players.Opponent,
                    activePromptTitle: 'Choose an attachment to discard',
                    cardCondition: (card) => card.parentCharacter === context.targets[CHARACTER],
                    message: '{0} discards {1}',
                    messageArgs: (card) => [context.targets[CHARACTER].controller, card],
                    gameAction: discardFromPlay()
                })),
                'Bow this character': bow((context) => ({
                    target: context.targets[CHARACTER]
                }))
            })
            .cannotTargetFirst();
    }
}
