import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class ExposedSecrets extends DrawCard {
    static id = 'exposed-secrets';

    setupCardAbilities() {
        this.conflictAction('Bow attacking character', { conflictType: ConflictType.Political })
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.politicalSkill <= card.controller.showBid
            }, bow());
    }
}


export default ExposedSecrets;
