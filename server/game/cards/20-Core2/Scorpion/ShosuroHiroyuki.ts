import { CardType, Players, ConflictType } from '../../../Constants.js';
import { conditional, discardAtRandom, dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroHiroyuki extends DrawCard {
    static id = 'shosuro-hiroyuki';

    setupCardAbilities() {
        this.conflictAction('Force opponent to discard card or dishonor a character', { conflictType: ConflictType.Political })
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.politicalSkill < context.source.politicalSkill
            }, conditional(({ target }) => ({
                condition: () => target.isDishonored,
                trueGameAction: discardAtRandom({
                    target: target.controller
                }),
                falseGameAction: dishonor({ target })
            })));
    }
}
