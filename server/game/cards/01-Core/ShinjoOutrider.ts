import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoOutrider extends DrawCard {
    static id = 'shinjo-outrider';

    setupCardAbilities() {
        this.action('Move this character to conflict')
            .gameAction(AbilityDsl.actions.moveToConflict());
    }
}


export default ShinjoOutrider;
