import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class RazeToTheGround extends DrawCard {
    static id = 'raze-to-the-ground';

    setupCardAbilities() {
        this.reaction({
            title: 'Break the attacked province',
            cost: [
                AbilityDsl.costs.dishonor({ cardCondition: (card) => card.isParticipating() }),
                AbilityDsl.costs.breakProvince({ cardCondition: (card) => card.isFaceup() })
            ],
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player && event.conflict.conflictType === 'military'
            },
            effect: 'break an attacked province',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.location !== Location.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.breakProvince()
            }))
        });
    }
}
