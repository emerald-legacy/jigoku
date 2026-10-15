import { doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Trait } from '../../Constants.js';
import { controlsParticipating } from '../controlsParticipating.js';

class ChikaiOrderProtector extends DrawCard {
    static id = 'chikai-order-protector';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && controlsParticipating(context.player, Trait.Courtier, Trait.Shugenja),
            effect: doesNotBow()
        });
    }
}


export default ChikaiOrderProtector;
