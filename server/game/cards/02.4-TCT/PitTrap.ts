import DrawCard from '../../drawcard.js';
import BaseCard from '../../basecard.js';
import Ring from '../../ring.js';
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
