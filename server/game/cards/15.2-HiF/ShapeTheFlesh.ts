import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class ShapeTheFlesh extends DrawCard {
    static id = 'shape-the-flesh';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.cardCannot('honor'),
                AbilityDsl.effects.addKeyword('covert')
            ]
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default ShapeTheFlesh;

