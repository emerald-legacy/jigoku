import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { discardStatusToken, selectToken } from '../../GameActions/GameActions.js';

class BeliefInTheLittleTeacher extends DrawCard {
    static id = 'belief-in-the-little-teacher';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.action('Discard character\'s status token', (ability) => ability
                .gameAction(selectToken((context) => ({
                    card: context.source,
                    activePromptTitle: 'Which token do you wish to discard?',
                    message: (_context, token, player) => msg`${player} discards ${token}`,
                    gameAction: discardStatusToken()
                })))
                .chatText((context) => msg`discard a status token from ${context.source}`))
        });
    }
}


export default BeliefInTheLittleTeacher;
