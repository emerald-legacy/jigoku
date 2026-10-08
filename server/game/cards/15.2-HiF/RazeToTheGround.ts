import { CardType, Location, ConflictType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { breakProvince } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class RazeToTheGround extends DrawCard {
    static id = 'raze-to-the-ground';

    setupCardAbilities() {
        this.reaction('Break the attacked province')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Military
            })
            .cost(costs.dishonor({ cardType: CardType.Character, cardCondition: (card) => card.isParticipating() }))
            .cost(costs.breakProvince({ cardCondition: (card) => card.isFaceup() }))
            .selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.location !== Location.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: breakProvince()
            }))
            .chatText('break an attacked province');
    }
}
