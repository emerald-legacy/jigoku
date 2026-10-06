import { Players, Location, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot } from '../../effects.js';

export default class KuniWasteland extends ProvinceCard {
    static id = 'kuni-wasteland';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            targetLocation: Location.PlayArea,
            match: (card) => card.type === CardType.Character,
            effect: [
                cardCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'nonForcedAbilities'
                }),
                cardCannot({
                    cannot: 'initiateKeywords',
                    restricts: 'keywordAbilities'
                })
            ]
        });
    }
}
