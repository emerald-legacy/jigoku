import { CardType, Location, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { breakProvince, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class RazeToTheGround extends DrawCard {
    static id = 'raze-to-the-ground';

    setupCardAbilities() {
        this.reaction('Break the attacked province')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Military
            })
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: (card) => card.isParticipating() }))
            .cost(AbilityDsl.costs.breakProvince({ cardCondition: (card) => card.isFaceup() }))
            .gameAction(selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.location !== Location.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: breakProvince()
            })))
            .effect('break an attacked province');
    }
}
