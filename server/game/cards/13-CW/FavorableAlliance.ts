import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { lookAt, multiple, setAside } from '../../GameActions/GameActions.js';

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
                setAside((context) => ({
                    target: context.player.conflictDeck.slice(0, context.costs.fatePaid),
                    playableBy: context.player
                }))
            ]))
            .chatText((context) => msg`set aside ${context.costs.fatePaid} card${(context.costs.fatePaid ?? 0) > 1 ? 's' : ''}`);
    }
}


export default FavorableAlliance;
