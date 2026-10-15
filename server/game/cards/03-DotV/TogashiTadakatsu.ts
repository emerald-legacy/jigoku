import DrawCard from '../../DrawCard.js';
import { Players, RestrictionType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class TogashiTadakatsu extends DrawCard {
    static id = 'togashi-tadakatsu';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: playerCannot(RestrictionType.ChooseConflictRing)
        });
    }
}


export default TogashiTadakatsu;

