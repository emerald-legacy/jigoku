import { Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { cannotResolveRings } from '../../effects.js';

class MountaintopVigil extends DrawCard {
    static id = 'mountaintop-vigil';

    override setupCardAbilities() {
        this.conflictAction('cancel all ring effects')
            .playerLastingEffect({
                target: Players.Any,
                effect: cannotResolveRings()
            })
            .chatText('cancel all ring effects until the end of the conflict');
    }
}


export default MountaintopVigil;
