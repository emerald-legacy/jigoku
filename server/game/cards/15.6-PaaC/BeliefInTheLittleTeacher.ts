import { msg } from '../../GameChat.js';
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
                    message: (_context, token, player) => msg`${player} discards ${token}`,
                    gameAction: discardStatusToken()
                })),
                chatText: 'discard a status token from {1}',
                chatTextArgs: (context) => [context.source]
            })
        });
    }
}


export default BeliefInTheLittleTeacher;
