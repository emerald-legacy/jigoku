import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class EnigmaticMagistrate extends DrawCard {
    static id = 'enigmatic-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return (card: BaseCard) => (card as DrawCard).getCost() === 0 || (((card as DrawCard).getCost() ?? 0) !== 0 && ((card as DrawCard).getCost() ?? 0) % 2 === 0);
            })
        });
    }
}


export default EnigmaticMagistrate;
