import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class SuperiorAuthority extends DrawCard {
    static id = 'superior-authority';

    override setupCardAbilities() {
        this.action('Stop characters with 0 fate from contributing skill')
            .condition((context) => context.game.isDuringConflict())
            .conflictLastingEffect({
                effect: cannotContribute(() => (card) => card.getFate() === 0)
            })
            .chatText('make it so that participating characters with 0 fate cannot contribute skill to conflict resolution');
    }
}


export default SuperiorAuthority;
