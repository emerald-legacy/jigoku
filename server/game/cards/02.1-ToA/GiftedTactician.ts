import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class GiftedTactician extends DrawCard {
    static id = 'gifted-tactician';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === 'military'
            },
            gameAction: ability.actions.draw()
        });
    }
}


export default GiftedTactician;
