import AbilityDsl from '../../../abilitydsl.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import { cancel } from '../../../GameActions/GameActions.js';
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
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .gameAction(cancel());
    }
}
