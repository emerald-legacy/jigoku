import DrawCard from '../../drawcard.js';

class IuchiShahai extends DrawCard {
    static id = 'iuchi-shahai';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.reduceCost({
                match: card => card.hasTrait('meishodo'),
                targetCondition: (target, source) => target === source || target.isFaction('neutral')
            })
        });
    }
}


export default IuchiShahai;
