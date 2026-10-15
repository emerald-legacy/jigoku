import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class MotoOutrider extends DrawCard {
    static id = 'moto-outrider';

    setupCardAbilities() {
        this.action('Ready this character')
            .condition((context) => context.source.isParticipating() && this.game.isDuringConflict(ConflictType.Military))
            .ready();
    }
}


export default MotoOutrider;


