import { alternateFatePool } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class AwakenedTsukumogami extends DrawCard {
    static id = 'awakened-tsukumogami';

    setupCardAbilities() {
        this.persistentEffect({
            effect: Object.values(this.game.rings).map(ring =>
                alternateFatePool((card) => card.isConflict && ring.getElements().some((element) => card.hasTrait(element)) && ring)
            )
        });
    }
}


export default AwakenedTsukumogami;
