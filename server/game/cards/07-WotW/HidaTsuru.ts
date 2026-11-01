import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class HidaTsuru extends DrawCard {
    static id = 'hida-tsuru';

    override setupCardAbilities() {
        this.reaction('Give this character +1/+1')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .chatText(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimited());

        this.reaction('Give this character +1/+1')
            .when({
                onCardPlayed: (event, context) => event.card.isParticipating() && context.source.isParticipating()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .chatText(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimited());
    }
}


export default HidaTsuru;
