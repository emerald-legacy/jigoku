import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class TetsuboOfBlood extends DrawCard {
    static id = 'tetsubo-of-blood';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('honor')
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default TetsuboOfBlood;
