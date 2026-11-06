import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class CunningMagistrate extends DrawCard {
    static id = 'cunning-magistrate';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: cannotContribute((card, context) => card.isDishonored && card !== context.source)
        });
    }
}


export default CunningMagistrate;
