import DrawCard from '../../DrawCard.js';
import { modifyCardsDrawnInDrawPhase } from '../../effects.js';
import { Players } from '../../Constants.js';

class IwasakiPupil extends DrawCard {
    static id = 'iwasaki-pupil';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: modifyCardsDrawnInDrawPhase(-2)
        });
    }
}


export default IwasakiPupil;
