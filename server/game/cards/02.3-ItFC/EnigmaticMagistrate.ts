import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class EnigmaticMagistrate extends DrawCard {
    static id = 'enigmatic-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return card => card.getCost() === 0 || card.getCost() && card.getCost() % 2 === 0;
            })
        });
    }
}


export default EnigmaticMagistrate;
