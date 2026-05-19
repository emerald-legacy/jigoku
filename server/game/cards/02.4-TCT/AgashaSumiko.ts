import DrawCard from '../../drawcard.js';

class AgashaSumiko extends DrawCard {
    static id = 'agasha-sumiko';

    setupCardAbilities(ability) {
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
