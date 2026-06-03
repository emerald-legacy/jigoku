import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class CallowDelegate extends DrawCard {
    static id = 'callow-delegate';

    setupCardAbilities() {
        this.interrupt({
            title: 'Honor a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default CallowDelegate;
