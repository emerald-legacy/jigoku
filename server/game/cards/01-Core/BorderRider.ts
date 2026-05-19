import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class BorderRider extends DrawCard {
    static id = 'border-rider';

    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            gameAction: AbilityDsl.actions.ready()
        });
    }
}


export default BorderRider;


