import DrawCard from '../../DrawCard.js';
import { dishonor } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class UnspokenEtiquette extends DrawCard {
    static id = 'unspoken-etiquette';

    setupCardAbilities() {
        this.conflictAction('Dishonor each participating non-courtier', { conflictType: ConflictType.Political })
            .gameAction(dishonor(context => ({
                target: context.game.currentConflict?.getParticipants((card) => !card.hasTrait('courtier')) ?? []
            })))
            .effect('dishonor each participating non-courtier');
    }
}


export default UnspokenEtiquette;

