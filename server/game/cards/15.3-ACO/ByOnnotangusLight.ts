import { Players, Location, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ByOnnotangusLight extends ProvinceCard {
    static id = 'by-onnotangu-s-light';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Any,
            targetLocation: Location.PlayArea,
            match: (card) => card.type === CardType.Character,
            effect: [AbilityDsl.effects.cardCannot({ cannot: 'removeFate' }), AbilityDsl.effects.setApparentFate(0)]
        });
    }
}
