import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';

class AgashaSumiko extends DrawCard {
    static id = 'agasha-sumiko';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => (
                context.player.imperialFavor !== '' &&
                context.source.isAttacking()
            ),
            effect: doesNotBow()
        });
    }
}


export default AgashaSumiko;
