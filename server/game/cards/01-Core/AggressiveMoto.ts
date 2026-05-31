import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AggressiveMoto extends DrawCard {
    static id = 'aggressive-moto';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('declareAsDefender')
        });
    }
}


export default AggressiveMoto;
