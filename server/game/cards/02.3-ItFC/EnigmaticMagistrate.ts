import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class EnigmaticMagistrate extends DrawCard {
    static id = 'enigmatic-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return (card) => {
                    const cost = card.getCost();
                    return cost !== null && cost % 2 === 0;
                };
            })
        });
    }
}


export default EnigmaticMagistrate;
