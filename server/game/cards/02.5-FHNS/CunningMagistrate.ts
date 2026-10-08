import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class CunningMagistrate extends DrawCard {
    static id = 'cunning-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: cannotContribute((_conflict, context) => {
                return (card) => card.isDishonored && card !== context.source;
            })
        });
    }
}


export default CunningMagistrate;
