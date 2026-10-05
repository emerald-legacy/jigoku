import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class BorderRider extends DrawCard {
    static id = 'border-rider';

    setupCardAbilities() {
        this.action('Ready this character')
            .gameAction(AbilityDsl.actions.ready());
    }
}


export default BorderRider;


