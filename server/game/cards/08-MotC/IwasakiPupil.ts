import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class IwasakiPupil extends DrawCard {
    static id = 'iwasaki-pupil';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: AbilityDsl.effects.modifyCardsDrawnInDrawPhase(-2)
        });
    }
}


export default IwasakiPupil;
