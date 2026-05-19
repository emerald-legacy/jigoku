import DrawCard from '../../drawcard.js';

class TheImperialPalace extends DrawCard {
    static id = 'the-imperial-palace';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.changePlayerGloryModifier(3)
        });
    }
}


export default TheImperialPalace;
