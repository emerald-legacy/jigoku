import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class Disarm extends DrawCard {
    static id = 'disarm';

    setupCardAbilities() {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardType.Attachment,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}


export default Disarm;


