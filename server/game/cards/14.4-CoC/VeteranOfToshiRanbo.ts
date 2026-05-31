import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class VeteranOfToshiRanbo extends DrawCard {
    static id = 'veteran-of-toshi-ranbo';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyGlory(() => this.controller ? this.controller.getNumberOfFaceupProvinces() : 0)
        });
    }
}


export default VeteranOfToshiRanbo;
