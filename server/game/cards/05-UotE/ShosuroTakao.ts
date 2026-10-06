import { moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class ShosuroTakao extends DrawCard {
    static id = 'shosuro-takao';

    setupCardAbilities() {
        this.action('Move this character into or out of the conflict')
            .condition(() => (this.game.currentConflict?.getNumberOfParticipants((card) => card.isDishonored) ?? 0) > 0)
            .gameAction(sendHome(), moveToConflict());
    }
}


export default ShosuroTakao;
