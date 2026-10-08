import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class HidaTsuru extends DrawCard {
    static id = 'hida-tsuru';

    setupCardAbilities() {
        this.reaction('Give this character +1/+1')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .chatText(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimitedPerConflict());

        this.reaction('Give this character +1/+1')
            .when({
                onCardPlayed: (event, context) => event.card.isParticipating() && context.source.isParticipating()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .chatText(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimitedPerConflict());
    }
}


export default HidaTsuru;
