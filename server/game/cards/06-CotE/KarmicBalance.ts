import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class KarmicBalance extends DrawCard {
    static id = 'karmic-balance';

    setupCardAbilities(ability: any) {
        this.action({
            title: 'Shuffle and draw 4 new conflict cards',
            gameAction: [
                ability.actions.moveCard((context: any) => ({
                    shuffle: true,
                    destination: Locations.ConflictDeck,
                    target: [...context.player.conflictDiscardPile, ...context.player.hand]
                })),
                ability.actions.moveCard((context: any) => ({
                    shuffle: true,
                    destination: Locations.ConflictDeck,
                    target: [...context.player.opponent.conflictDiscardPile, ...context.player.opponent.hand]
                })),
                ability.actions.draw((context: any) => ({ target: context.game.getPlayers(), amount: 4 })),
                ability.actions.moveCard((context: any) => ({ target: context.source, destination: Locations.RemovedFromGame }))
            ],
            effect: 'shuffle hand and discard pile into conflict deck and draw 4 cards'
        });
    }

    canPlay(context: any) {
        if(context.player.opponent && context.player.showBid === context.player.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}


export default KarmicBalance;
