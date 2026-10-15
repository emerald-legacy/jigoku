import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class UnspokenEtiquette extends DrawCard {
    static id = 'unspoken-etiquette';

    setupCardAbilities() {
        this.conflictAction('Dishonor each participating non-courtier', { conflictType: ConflictType.Political })
            .dishonor((context) => ({
                target: context.game.currentConflict?.getParticipants((card) => !card.hasTrait('courtier')) ?? []
            }))
            .chatText('dishonor each participating non-courtier');
    }
}


export default UnspokenEtiquette;

