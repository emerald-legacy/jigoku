import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';

class PerfectLandBeliever extends DrawCard {
    static id = 'perfect-land-believer';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isOrdinary(),
            match: (card, context) => card === context?.source,
            effect: modifyBothSkills(2)
        });
    }
}


export default PerfectLandBeliever;
