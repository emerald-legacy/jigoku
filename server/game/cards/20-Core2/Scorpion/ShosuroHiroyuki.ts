import { CardType, Players, ConflictType } from '../../../Constants.js';
import { conditional, discardAtRandom, dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroHiroyuki extends DrawCard {
    static id = 'shosuro-hiroyuki';

    setupCardAbilities() {
        this.action('Force opponent to discard card or dishonor a character')
            .condition((context) => context.source.isParticipating(ConflictType.Political))
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
