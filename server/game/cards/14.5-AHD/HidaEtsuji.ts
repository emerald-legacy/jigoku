import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import { cardCannot, increaseLimitOnAbilities } from '../../effects.js';

class HidaEtsuji extends DrawCard {
    static id = 'hida-etsuji';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.type === CardType.Province && card.controller === context?.player,
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            effect: increaseLimitOnAbilities()
        });

        this.persistentEffect({
            effect: cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });
    }
}


export default HidaEtsuji;
