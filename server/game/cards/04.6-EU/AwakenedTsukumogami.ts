import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class AwakenedTsukumogami extends DrawCard {
    static id = 'awakened-tsukumogami';

    setupCardAbilities() {
        this.persistentEffect({
            effect: Object.values(this.game.rings).map(ring =>
                AbilityDsl.effects.alternateFatePool((card: DrawCard) => card.isConflict && ring.getElements().some((element: string) => card.hasTrait(element)) && ring)
            )
        });
    }
}


export default AwakenedTsukumogami;
