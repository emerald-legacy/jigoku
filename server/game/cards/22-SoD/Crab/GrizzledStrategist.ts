import * as costs from '../../../costs/index.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';

export default class GrizzledStrategist extends DrawCard {
    static id = 'grizzled-strategist';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });

        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.source.isParticipating() &&
                    event.card.type === CardType.Event
            })
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .cancel();
    }
}
