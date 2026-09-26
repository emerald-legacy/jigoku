import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class KarmicBalance extends DrawCard {
    static id = 'karmic-balance';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Shuffle and draw 4 new conflict cards')
            .gameAction(ability.actions.moveCard((context) => ({
                shuffle: true,
                destination: Location.ConflictDeck,
                target: [...context.player.conflictDiscardPile, ...context.player.hand]
            })), ability.actions.moveCard((context) => ({
                shuffle: true,
                destination: Location.ConflictDeck,
                target: context.player.opponent ? [...context.player.opponent.conflictDiscardPile, ...context.player.opponent.hand] : []
            })), ability.actions.draw((context) => ({ target: context.game.getPlayers(), amount: 4 })), ability.actions.moveCard((context) => ({ target: context.source, destination: Location.RemovedFromGame })))
            .effect('shuffle hand and discard pile into conflict deck and draw 4 cards');
    }

    canPlay(context: AbilityContext) {
        if(context.player.opponent && context.player.showBid === context.player.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}


export default KarmicBalance;
