import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class WorldlyShiotome extends DrawCard {
    static id = 'worldly-shiotome';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor this character',
            when: {
                onCardPlayed: (event, context) => event.card.hasTrait('gaijin') && event.player === context.player
            },
            gameAction: AbilityDsl.actions.honor()
        });
    }
}


export default WorldlyShiotome;
