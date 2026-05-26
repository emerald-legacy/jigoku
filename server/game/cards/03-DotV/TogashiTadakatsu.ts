import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiTadakatsu extends DrawCard {
    static id = 'togashi-tadakatsu';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            targetController: Players.Any,
            effect: ability.effects.playerCannot('chooseConflictRing')
        });
    }
}


export default TogashiTadakatsu;

