import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const CHARACTER = 'CHARACTER';
const SELECT = 'SELECT';

export default class AkodoCho extends DrawCard {
    static id = 'akodo-cho';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) =>
                context.source.isParticipating() &&
                context.source.attachments.some((attachment: any) => attachment.hasTrait('follower')),
            targets: {
                [CHARACTER]: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) =>
                        card.isParticipating() && context.game.actions.bow().canAffect(card, context)
                },
                [SELECT]: {
                    mode: TargetMode.Select,
                    dependsOn: CHARACTER,
                    player: (context) =>
                        (context.targets[CHARACTER] as DrawCard).controller === context.player ? Players.Self : Players.Opponent,
                    choices: {
                        'Discard an attachment from this character': AbilityDsl.actions.selectCard((context) => ({
                            cardType: CardType.Attachment,
                            effect: 'discard an attachment on {0}',
                            effectArgs: () => [context.targets[CHARACTER]],
                            player:
                                context.targets[CHARACTER].controller === context.player
                                    ? Players.Self
                                    : Players.Opponent,
                            activePromptTitle: 'Choose an attachment to discard',
                            cardCondition: (card) => card.parent === context.targets[CHARACTER],
                            message: '{0} discards {1}',
                            messageArgs: (card) => [context.targets[CHARACTER].controller, card],
                            gameAction: AbilityDsl.actions.discardFromPlay()
                        })),
                        'Bow this character': AbilityDsl.actions.bow((context) => ({
                            target: context.targets[CHARACTER]
                        }))
                    }
                }
            },
            cannotTargetFirst: true
        });
    }
}
