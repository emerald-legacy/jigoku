import { CardType, ConflictType } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class LancerOfThe9thLegion extends DrawCard {
    static id = 'lancer-of-the-9th-legion';

    override setupCardAbilities() {
        this.conflictAction('Bow a character', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    card.militarySkill <= context.source.militarySkill
            }, bow());
    }
}
