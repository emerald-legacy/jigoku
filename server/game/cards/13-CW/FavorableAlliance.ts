import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { canPlayFromOwn } from '../../effects.js';
import { handler, lookAt, multiple } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class FavorableAlliance extends DrawCard {
    static id = 'favorable-alliance';

    setupCardAbilities() {
        this.action('Draw cards')
            .cost(costs.payVariableFate({
                minAmount: 1,
                maxAmount: (context) => context.player.conflictDeck.length,
                activePromptTitle: 'Choose a value for X'
            }))
            .gameAction(multiple([
                lookAt((context) => ({
                    target: context.player.conflictDeck.slice(0, context.costs.fatePaid),
                    message: (context, cards) => msg`${context.player} sets aside the top ${cards.length} card${cards.length > 1 ? 's' : ''} from their conflict deck: ${cards}`
                })),
                handler({
                    handler: (context) => {
                        const cards = context.player.conflictDeck.slice(0, context.costs.fatePaid);
                        cards.forEach((card) => {
                            card.owner.removeCardFromPile(card);
                            card.moveTo(Location.RemovedFromGame);
                            context.player.removedFromGame.unshift(card);
                            context.source.lastingEffect({
                                until: {
                                    onCardMoved: (event) =>
                                        event.card === card && event.originalLocation === Location.RemovedFromGame
                                },
                                match: card,
                                effect: [canPlayFromOwn(Location.RemovedFromGame, [card], this)]
                            });
                        });
                    }
                })
            ]))
            .chatText('set aside {1} card{2}', (context) => [context.costs.fatePaid, (context.costs.fatePaid ?? 0) > 1 ? 's' : '']);
    }
}


export default FavorableAlliance;
