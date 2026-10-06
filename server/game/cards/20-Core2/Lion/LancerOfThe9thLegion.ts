import { CardType, Players, ConflictType } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class LancerOfThe9thLegion extends DrawCard {
    static id = 'lancer-of-the-9th-legion';

    setupCardAbilities() {
        this.conflictAction('Bow a character', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.getMilitarySkill() <= context.source.getMilitarySkill()
            }, bow());
    }
}
