import { CardTypes, Durations, Locations, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class HidaHonoka extends DrawCard {
    static id = 'hida-honoka';

    setupCardAbilities() {
        this.action({
            title: 'Restore a province',
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: (card) => card.isBroken,
                gameAction: AbilityDsl.actions.restoreProvince()
            },
            then: {
                gameAction: AbilityDsl.actions.playerLastingEffect({
                    targetController: Players.Self,
                    duration: Durations.Custom,
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
