import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AgashaSumiko extends DrawCard {
    static id = 'agasha-sumiko';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => (
                context.player.imperialFavor !== '' &&
                context.source.isAttacking()
            ),
            effect: ability.effects.doesNotBow()
        });
    }
}


export default AgashaSumiko;
