import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class KarmicBalance extends DrawCard {
    static id = 'karmic-balance';

    override setupCardAbilities() {
        this.action('Shuffle and draw 4 new conflict cards')
            .playOnlyIf((context) => !!context.player.opponent && context.player.showBid === context.player.opponent.showBid)
            .moveCard((context) => ({
                shuffle: true,
                destination: Location.ConflictDeck,
                target: [...context.player.conflictDiscardPile, ...context.player.hand]
            }))
            .moveCard((context) => ({
                shuffle: true,
                destination: Location.ConflictDeck,
                target: context.player.opponent ? [...context.player.opponent.conflictDiscardPile, ...context.player.opponent.hand] : []
            }))
            .draw((context) => ({ target: context.game.getPlayers(), amount: 4 }))
            .moveCard((context) => ({ target: context.source, destination: Location.RemovedFromGame }))
            .chatText('shuffle hand and discard pile into conflict deck and draw 4 cards');
    }
}


export default KarmicBalance;
