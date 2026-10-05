import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaYojimbo extends DrawCard {
    static id = 'hiruma-yojimbo';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cannotBeDeclaredAsAttacker()
        });
    }
}


export default HirumaYojimbo;
