import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AgelessCrone extends DrawCard {
    static id = 'ageless-crone';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            effect: AbilityDsl.effects.increaseCost({
                amount: 1,
                match: (card) => card.type === CardType.Event
            })
        });
    }
}


export default AgelessCrone;
