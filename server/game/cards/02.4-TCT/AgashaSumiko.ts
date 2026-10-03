import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AgashaSumiko extends DrawCard {
    static id = 'agasha-sumiko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                context.player.imperialFavor !== '' &&
                context.source.isAttacking()
            ),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default AgashaSumiko;
