import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';

class Disarm extends DrawCard {
    static id = 'disarm';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay());
    }
}


export default Disarm;


