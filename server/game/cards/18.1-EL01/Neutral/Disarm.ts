import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class Disarm extends DrawCard {
    static id = 'disarm';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target('target', {
                cardType: CardType.Attachment
            }, AbilityDsl.actions.discardFromPlay());
    }
}


export default Disarm;


