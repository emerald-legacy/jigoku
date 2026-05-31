import DrawCard from '../../DrawCard.js';
import BaseCard from '../../BaseCard.js';
import Ring from '../../Ring.js';
import AbilityDsl from '../../abilitydsl.js';

class PitTrap extends DrawCard {
    static id = 'pit-trap';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.doesNotReady()
        });
    }

    canPlayOn(card: BaseCard | Ring): boolean {
        return (card as any).isAttacking() && super.canPlayOn(card);
    }
}


export default PitTrap;
