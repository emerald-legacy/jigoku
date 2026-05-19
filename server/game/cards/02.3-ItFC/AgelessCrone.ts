import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class AgelessCrone extends DrawCard {
    static id = 'ageless-crone';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            effect: ability.effects.increaseCost({
                amount: 1,
                match: card => card.type === CardTypes.Event
            })
        });
    }
}


export default AgelessCrone;
