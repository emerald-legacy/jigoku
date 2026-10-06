import DrawCard from '../../DrawCard.js';
import { cancel, discardFromPlay } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class Reprieve extends DrawCard {
    static id = 'reprieve';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source.parentCharacter && event.card.location === Location.PlayArea &&
                                                      context.source.allowGameAction('discardFromPlay', context)
            })
            .gameAction(cancel(context => ({
                target: context.source,
                replacementGameAction: discardFromPlay()
            })))
            .effect('prevent {1} from leaving play', context => context.event.card);
    }
}


export default Reprieve;
