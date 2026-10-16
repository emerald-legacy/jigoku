import { Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { cannotResolveRings } from '../../effects.js';

class MountaintopVigil extends DrawCard {
    static id = 'mountaintop-vigil';

    override setupCardAbilities() {
        this.action('cancel all ring effects')
            .condition((context) => context.game.isDuringConflict())
            .playerLastingEffect({
                target: Players.Any,
                effect: cannotResolveRings()
            })
            .chatText('cancel all ring effects until the end of the conflict');
    }
}


export default MountaintopVigil;
