import { Trait } from '../../Constants.js';
import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class IuchiShahai extends DrawCard {
    static id = 'iuchi-shahai';

    setupCardAbilities() {
        this.persistentEffect({
            effect: reduceCost({
                match: (card) => card.hasTrait(Trait.Meishodo),
                targetCondition: (target, source) => target === source || target.isFaction('neutral')
            })
        });
    }
}


export default IuchiShahai;
