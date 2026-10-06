import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ConflictType } from '../../Constants.js';

class UnspokenEtiquette extends DrawCard {
    static id = 'unspoken-etiquette';

    setupCardAbilities() {
        this.conflictAction('Dishonor each participating non-courtier', { conflictType: ConflictType.Political })
            .gameAction(AbilityDsl.actions.dishonor(context => ({
                target: context.game.currentConflict?.getParticipants((card) => !card.hasTrait('courtier')) ?? []
            })))
            .effect('dishonor each participating non-courtier');
    }
}


export default UnspokenEtiquette;

