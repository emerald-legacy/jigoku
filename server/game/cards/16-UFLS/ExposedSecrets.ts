import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExposedSecrets extends DrawCard {
    static id = 'exposed-secrets';

    setupCardAbilities() {
        this.conflictAction('Bow attacking character', { conflictType: ConflictType.Political })
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.getPoliticalSkill() <= card.controller.showBid
            }, AbilityDsl.actions.bow());
    }
}


export default ExposedSecrets;
