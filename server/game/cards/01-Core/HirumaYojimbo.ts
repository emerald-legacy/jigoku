import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaYojimbo extends DrawCard {
    static id = 'hiruma-yojimbo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('declareAsAttacker')
        });
    }
}


export default HirumaYojimbo;
