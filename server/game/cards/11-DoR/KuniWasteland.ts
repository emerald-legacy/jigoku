import { Players, Location, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KuniWasteland extends ProvinceCard {
    static id = 'kuni-wasteland';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            targetLocation: Location.PlayArea,
            match: (card) => card.type === CardType.Character,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'nonForcedAbilities'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'initiateKeywords',
                    restricts: 'keywordAbilities'
                })
            ]
        });
    }
}
