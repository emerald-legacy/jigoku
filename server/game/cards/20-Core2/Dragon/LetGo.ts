import { CardType } from '../../../Constants.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class LetGo extends DrawCard {
    static id = 'let-go';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay());
    }
}
