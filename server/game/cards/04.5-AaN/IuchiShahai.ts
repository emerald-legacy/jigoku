import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class IuchiShahai extends DrawCard {
    static id = 'iuchi-shahai';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                match: (card: any) => card.hasTrait('meishodo'),
                targetCondition: (target: any, source: any) => target === source || target.isFaction('neutral')
            })
        });
    }
}


export default IuchiShahai;
