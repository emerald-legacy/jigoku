import type AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Locations } from '../../Constants.js';

class KarmicBalance extends DrawCard {
    static id = 'karmic-balance';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Shuffle and draw 4 new conflict cards',
            gameAction: [
                ability.actions.moveCard((context: AbilityContext) => ({
                    shuffle: true,
                    destination: Locations.ConflictDeck,
                    target: [...context.player.conflictDiscardPile, ...context.player.hand]
                })),
                ability.actions.moveCard((context: AbilityContext) => ({
                    shuffle: true,
                    destination: Locations.ConflictDeck,
                    target: [...(context.player.opponent as Player).conflictDiscardPile, ...(context.player.opponent as Player).hand]
                })),
                ability.actions.draw((context: AbilityContext) => ({ target: context.game.getPlayers(), amount: 4 })),
                ability.actions.moveCard((context: AbilityContext) => ({ target: context.source, destination: Locations.RemovedFromGame }))
            ],
            effect: 'shuffle hand and discard pile into conflict deck and draw 4 cards'
        });
    }

    canPlay(context: AbilityContext) {
        if(context.player.opponent && context.player.showBid === context.player.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}


export default KarmicBalance;
