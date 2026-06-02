import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class MasterOfTheCourt extends DrawCard {
    static id = 'master-of-the-court';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Event && context.source.isHonored
            },
            cost: AbilityDsl.costs.discardStatusTokenFromSelf(),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default MasterOfTheCourt;
