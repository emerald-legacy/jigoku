import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { CardType, CharacterStatus } from '../../Constants.js';

class MasterOfTheCourt extends DrawCard {
    static id = 'master-of-the-court';

    override setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Event && context.source.isHonored
            })
            .cost(costs.discardStatusTokenFromSelf(CharacterStatus.Honored))
            .cancel();
    }
}


export default MasterOfTheCourt;
