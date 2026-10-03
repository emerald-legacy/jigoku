import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class GiftedTactician extends DrawCard {
    static id = 'gifted-tactician';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === 'military'
            })
            .gameAction(AbilityDsl.actions.draw());
    }
}


export default GiftedTactician;
