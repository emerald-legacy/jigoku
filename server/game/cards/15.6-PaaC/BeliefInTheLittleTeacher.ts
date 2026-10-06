import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { discardStatusToken, selectToken } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';

class BeliefInTheLittleTeacher extends DrawCard {
    static id = 'belief-in-the-little-teacher';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Discard character\'s status token',
                gameAction: selectToken((context) => ({
                    card: context.source,
                    activePromptTitle: 'Which token do you wish to discard?',
                    message: '{0} discards {1}',
                    messageArgs: (token, player) => [player, token],
                    gameAction: discardStatusToken()
                })),
                effect: 'discard a status token from {1}',
                effectArgs: (context) => [context.source]
            })
        });
    }
}


export default BeliefInTheLittleTeacher;
