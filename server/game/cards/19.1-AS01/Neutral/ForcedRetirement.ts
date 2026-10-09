import { msg } from '../../../GameChat.js';
import {
    discardFromPlay,
    discardStatusToken,
    gainHonor,
    multiple,
    removeFate,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import { CardType, Players, CharacterStatus } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ForcedRetirement extends DrawCard {
    static id = 'forced-retirement';

    public setupCardAbilities() {
        this.action('Remove negative status tokens from a character, and discard it from play')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => (card.isDishonored || card.isTainted) && !card.isParticipating()
            })
            .gameAction(sequentialContext((context) => ({
                gameActions: [
                    multiple([
                        discardStatusToken({
                            target: context.target.statusTokens.filter(
                                (t) =>
                                    t.grantedStatus === CharacterStatus.Dishonored ||
                                    t.grantedStatus === CharacterStatus.Tainted
                            )
                        }),
                        removeFate({
                            target: context.target,
                            amount: context.target.getFate(),
                            recipient: context.target.owner
                        })
                    ]),
                    multiple([
                        discardFromPlay({
                            target: context.target
                        }),
                        gainHonor({
                            target: context.player
                        })
                    ])
                ]
            })))
            .chatText((context) => context.target.fate > 0
                ? msg`expiate ${context.chatTarget()}'s misdeeds by retiring them to the nearest monastery, recovering their ${context.target.fate} fate. Let them contemplate their sins`
                : msg`expiate ${context.chatTarget()}'s misdeeds by retiring them to the nearest monastery. Let them contemplate their sins`);
    }
}
