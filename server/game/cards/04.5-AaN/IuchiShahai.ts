import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class IuchiShahai extends DrawCard {
    static id = 'iuchi-shahai';

    setupCardAbilities() {
        this.persistentEffect({
            effect: reduceCost({
                match: (card) => card.hasTrait('meishodo'),
                targetCondition: (target, source) => target === source || target.isFaction('neutral')
            })
        });
    }
}


export default IuchiShahai;
