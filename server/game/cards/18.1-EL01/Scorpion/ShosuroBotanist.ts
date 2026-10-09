import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { returnToHand } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';

class ShosuroBotanist extends DrawCard {
    static id = 'shosuro-botanist';

    setupCardAbilities() {
        this.action('Return attachment to owners hand')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Self,
                cardCondition: (card) => !card.hasTrait('weapon')
            }, returnToHand())
            .chatText((context) => msg`return ${context.chatTarget()} to ${context.target.owner}'s hand`);
    }
}

export default ShosuroBotanist;
