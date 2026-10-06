import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class TogashiTadakatsu extends DrawCard {
    static id = 'togashi-tadakatsu';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: playerCannot('chooseConflictRing')
        });
    }
}


export default TogashiTadakatsu;

