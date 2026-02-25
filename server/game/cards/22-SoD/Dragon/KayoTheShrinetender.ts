import { Players, Durations, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KayoTheShrinetender extends DrawCard {
    static id = 'kayo-the-shrinetender';

    setupCardAbilities() {
        this.action({
            title: 'Ready a Temple',
            target: {
                cardCondition: card => card.hasTrait('temple') && !card.facedown,
                controller: Players.Self,
                location: [Locations.Provinces, Locations.PlayArea],
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfRound,
                        targetLocation: Locations.Provinces,
                        effect: AbilityDsl.effects.increaseLimitOnAbilities()
                    })
                ])
            },
            effect: 'ready {0} and add an additional use to each of its abilities'
        });
    }
}
