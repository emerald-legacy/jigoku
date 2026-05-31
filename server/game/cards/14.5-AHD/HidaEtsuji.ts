import DrawCard from '../../DrawCard.js';
import { Locations, Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HidaEtsuji extends DrawCard {
    static id = 'hida-etsuji';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.type === CardTypes.Province && card.controller === context?.player,
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            effect: AbilityDsl.effects.increaseLimitOnAbilities()
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });
    }
}


export default HidaEtsuji;
