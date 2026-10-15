import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class DiscipleOfShinsei extends DrawCard {
    static id = 'disciple-of-shinsei';

    setupCardAbilities() {
        this.interrupt('Discard an attachment')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay());
    }
}


export default DiscipleOfShinsei;


