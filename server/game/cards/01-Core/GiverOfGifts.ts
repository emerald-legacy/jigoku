import { msg } from '../../GameChat.js';
import { attach, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class GiverOfGifts extends DrawCard {
    static id = 'giver-of-gifts';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Self
            }, selectCard((context) => ({
                controller: Players.Self,
                cardCondition: (card) => card !== context.target.parentCharacter,
                message: (context, card) => msg`${context.player} moves ${context.target} to ${card}`,
                gameAction: attach({ attachment: context.target })
            })))
            .chatText('move {0} to another character');
    }
}


export default GiverOfGifts;
