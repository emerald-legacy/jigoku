import { CardType, Duration, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class HidaHonoka extends DrawCard {
    static id = 'hida-honoka';

    setupCardAbilities() {
        this.action('Restore a province')
            .target('target', {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => (card).isBroken
            }, AbilityDsl.actions.restoreProvince())
            .then(() => ({
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
            }));
    }
}
