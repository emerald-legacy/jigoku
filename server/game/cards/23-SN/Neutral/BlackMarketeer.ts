import DrawCard from '../../../DrawCard.js';
import { CardType, Location, PlayType, Players } from '../../../Constants.js';
import { playCard } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class BlackMarketeer extends DrawCard {
    static id = 'black-marketeer';

    setupCardAbilities() {
        this.action('Play an attachment')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Opponent,
                location: Location.ConflictDiscardPile
            }, playCard({
                resetOnCancel: true,
                source: this,
                playType: PlayType.PlayFromHand,
                payFateToOpponent: true
            }))
            .effect((context) => msg`buy an attachment from ${context.player.opponent}'s discard pile`);
    }
}
