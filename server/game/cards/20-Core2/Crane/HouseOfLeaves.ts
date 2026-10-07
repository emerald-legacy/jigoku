import { CardType, Duration, Phases, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { modifyGlory } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class HouseOfLeaves extends StrongholdCard {
    static id = 'house-of-leaves';

    setupCardAbilities() {
        this.action('Bow this stronghold')
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isParticipating(),
                controller: Players.Self
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: modifyGlory(2)
            }))
            .effect('give +2 glory to {0} for this phase')
            .phase(Phases.Conflict);
    }
}
