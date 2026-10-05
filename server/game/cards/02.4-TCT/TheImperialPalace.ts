import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TheImperialPalace extends DrawCard {
    static id = 'the-imperial-palace';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.changePlayerGloryModifier(3)
        });
    }
}


export default TheImperialPalace;
