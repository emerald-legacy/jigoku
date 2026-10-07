import DrawCard from '../../DrawCard.js';
import { cannotResolveRings } from '../../effects.js';
import { Players } from '../../Constants.js';

class MountaintopVigil extends DrawCard {
    static id = 'mountaintop-vigil';

    setupCardAbilities() {
        this.conflictAction('cancel all ring effects')
            .playerLastingEffect({
                targetController: Players.Any,
                effect: cannotResolveRings()
            })
            .effect('cancel all ring effects until the end of the conflict');
    }
}


export default MountaintopVigil;
