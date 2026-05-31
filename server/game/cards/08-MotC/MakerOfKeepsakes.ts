import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MakerOfKeepsakes extends DrawCard {
    static id = 'maker-of-keepsakes';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });
    }
}


export default MakerOfKeepsakes;
