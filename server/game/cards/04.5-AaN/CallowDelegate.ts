import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class CallowDelegate extends DrawCard {
    static id = 'callow-delegate';

    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Honor a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default CallowDelegate;
