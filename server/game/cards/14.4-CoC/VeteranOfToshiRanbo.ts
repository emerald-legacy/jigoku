import DrawCard from '../../DrawCard.js';
import { modifyGlory } from '../../effects.js';

class VeteranOfToshiRanbo extends DrawCard {
    static id = 'veteran-of-toshi-ranbo';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory(() => this.controller ? this.controller.getNumberOfFaceupProvinces() : 0)
        });
    }
}


export default VeteranOfToshiRanbo;
