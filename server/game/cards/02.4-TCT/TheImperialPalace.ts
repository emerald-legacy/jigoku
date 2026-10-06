import DrawCard from '../../DrawCard.js';
import { changePlayerGloryModifier } from '../../effects.js';

class TheImperialPalace extends DrawCard {
    static id = 'the-imperial-palace';

    setupCardAbilities() {
        this.persistentEffect({
            effect: changePlayerGloryModifier(3)
        });
    }
}


export default TheImperialPalace;
