import { CardType, Players, ConflictType } from '../../../Constants.js';
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
            })
            .if((context) => context.target.isDishonored)
                .discardAtRandom((context) => ({ target: context.target.controller }))
            .otherwise()
                .dishonor();
    }
}
