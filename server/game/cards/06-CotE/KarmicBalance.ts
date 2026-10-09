import { draw, moveCard } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class KarmicBalance extends DrawCard {
    static id = 'karmic-balance';

    setupCardAbilities() {
        this.action('Shuffle and draw 4 new conflict cards')
            .gameAction(moveCard((context) => ({
                shuffle: true,
                destination: Location.ConflictDeck,
                target: [...context.player.conflictDiscardPile, ...context.player.hand]
            })), moveCard((context) => ({
                shuffle: true,
                destination: Location.ConflictDeck,
                target: context.player.opponent ? [...context.player.opponent.conflictDiscardPile, ...context.player.opponent.hand] : []
            })), draw((context) => ({ target: context.game.getPlayers(), amount: 4 })), moveCard((context) => ({ target: context.source, destination: Location.RemovedFromGame })))
            .chatText('shuffle hand and discard pile into conflict deck and draw 4 cards');
    }

    canPlay(context: AbilityContext) {
        if(context.player.opponent && context.player.showBid === context.player.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}


export default KarmicBalance;
