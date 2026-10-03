import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiRepresentative extends DrawCard {
    static id = 'doji-representative';

    setupCardAbilities() {
        this.action('Move this character home')
            .gameAction(AbilityDsl.actions.sendHome());
    }
}


export default DojiRepresentative;
