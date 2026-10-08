import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class CompellingTestimony extends DrawCard {
    static id = 'compelling-testimony';

    setupCardAbilities() {
        this.conflictAction('Give a character -4 political', { conflictType: ConflictType.Political })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyPoliticalSkill(-4)
            }))
            .chatText('give {0} -4{1}', () => ['political']);
    }
}


export default CompellingTestimony;
