import DrawCard from '../../../DrawCard.js';
import { CardType, Location, PlayType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class BlackMarketeer extends DrawCard {
    static id = 'black-marketeer';

    setupCardAbilities() {
        this.action('Play an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Opponent,
                location: Location.ConflictDiscardPile
            }, AbilityDsl.actions.playCard({
                resetOnCancel: true,
                source: this,
                playType: PlayType.PlayFromHand,
                payFateToOpponent: true
            }))
            .effect('buy an attachment from {1}\'s discard pile', context => [context.player.opponent]);
    }
}
