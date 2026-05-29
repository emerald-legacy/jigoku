import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TheImperialPalace extends DrawCard {
    static id = 'the-imperial-palace';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.changePlayerGloryModifier(3)
        });
    }
}


export default TheImperialPalace;
