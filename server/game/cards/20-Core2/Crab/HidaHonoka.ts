import { CardType, Duration, Location, Players, RestrictionType } from '../../../Constants.js';
import { playerCannot } from '../../../effects.js';
import { restoreProvince } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class HidaHonoka extends DrawCard {
    static id = 'hida-honoka';

    setupCardAbilities() {
        this.action('Restore a province')
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isBroken
            }, restoreProvince())
            .then()
            .playerLastingEffect({
                targetController: Players.Self,
                duration: Duration.Custom,
                until: {
                    // FOREVER
                    onCardLeavesPlay: () => false
                },
                effect: playerCannot({
                    cannot: RestrictionType.RestoreProvince
                })
            });
    }
}
