import { CardType, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { chosenDiscard, conditional, discardAtRandom } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TalkWithTheServants extends DrawCard {
    static id = 'talk-with-the-servants';

    setupCardAbilities() {
        this.reaction('Force opponent to discard 2 cards')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Political
            })
            .cost(AbilityDsl.costs.dishonor({
                optional: true,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .gameAction(conditional({
                condition: (context) => context.costs.dishonor instanceof DrawCard,
                trueGameAction: discardAtRandom((context) => ({
                    amount: 2,
                    target: context.player.opponent
                })),
                falseGameAction: chosenDiscard((context) => ({
                    amount: 2,
                    target: context.player.opponent
                }))
            }))
            .max(AbilityDsl.limit.perConflict(1));
    }
}
