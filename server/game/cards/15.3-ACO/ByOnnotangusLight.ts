import { Players, Location, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, setApparentFate } from '../../effects.js';

export default class ByOnnotangusLight extends ProvinceCard {
    static id = 'by-onnotangu-s-light';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Any,
            targetLocation: Location.PlayArea,
            match: (card) => card.type === CardType.Character,
            effect: [cardCannot({ cannot: 'removeFate' }), setApparentFate(0)]
        });
    }
}
