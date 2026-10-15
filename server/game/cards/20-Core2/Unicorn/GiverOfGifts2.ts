import { msg } from '../../../GameChat.js';
import { attach, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class GiverOfGifts2 extends DrawCard {
    static id = 'giver-of-gifts-2';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Self
            }, selectCard((context) => ({
                cardCondition: (card) =>
                    card !== context.target?.parentCharacter && card.controller === context.target?.parentCharacter?.controller,
                message: (context, card) => msg`${context.player} moves ${context.target} to ${card}`,
                gameAction: attach({ attachment: context.target })
            })))
            .chatText('move {0} to another character');
    }
}
