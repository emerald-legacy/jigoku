import DrawCard from '../../drawcard.js';

class AwakenedTsukumogami extends DrawCard {
    static id = 'awakened-tsukumogami';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: Object.values(this.game.rings).map(ring =>
                ability.effects.alternateFatePool(card => card.isConflict && ring.getElements().some(element => card.hasTrait(element)) && ring)
            )
        });
    }
}


export default AwakenedTsukumogami;
