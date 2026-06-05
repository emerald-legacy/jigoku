import { CardType, Duration, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import DrawCard from '../../../DrawCard.js';

export default class HidaHonoka extends DrawCard {
    static id = 'hida-honoka';

    setupCardAbilities() {
        this.action({
            title: 'Restore a province',
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card: BaseCard) => (card as ProvinceCard).isBroken,
                gameAction: AbilityDsl.actions.restoreProvince()
            },
            then: {
                gameAction: AbilityDsl.actions.playerLastingEffect({
                    targetController: Players.Self,
                    duration: Duration.Custom,
                    until: {
                        // FOREVER
                        onCardLeavesPlay: () => false
                    },
                    effect: AbilityDsl.effects.playerCannot({
                        cannot: 'restoreProvince'
                    })
                })
            }
        });
    }
}
