import { msg } from '../../../GameChat.js';
import { bow, discardFromPlay, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const CHARACTER = 'CHARACTER';
const SELECT = 'SELECT';

export default class AkodoCho extends DrawCard {
    static id = 'akodo-cho';

    override setupCardAbilities() {
        this.conflictAction('Bow a character')
            .condition((context) =>
                context.source.attachments.some((attachment) => attachment.hasTrait(Trait.Follower)))
            .target({
                name: CHARACTER,
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: SELECT,
                dependsOn: CHARACTER,
                player: (context) =>
                    context.targets[CHARACTER].controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Discard an attachment from this character': selectCard((context) => ({
                    cardType: CardType.Attachment,
                    chatText: () => msg`discard an attachment on ${context.targets[CHARACTER]}`,
                    player:
                                context.targets[CHARACTER].controller === context.player
                                    ? Players.Self
                                    : Players.Opponent,
                    activePromptTitle: 'Choose an attachment to discard',
                    cardCondition: (card) => card.parentCharacter === context.targets[CHARACTER],
                    message: (context, card) => msg`${context.targets[CHARACTER].controller} discards ${card}`,
                    gameAction: discardFromPlay()
                })),
                'Bow this character': bow((context) => ({
                    target: context.targets[CHARACTER]
                }))
            })
            .cannotTargetFirst();
    }
}
