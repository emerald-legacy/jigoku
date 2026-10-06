import DrawCard from '../../DrawCard.js';
import { chosenDiscard, draw, sequential } from '../../GameActions/GameActions.js';

class OracleOfStone extends DrawCard {
    static id = 'oracle-of-stone';

    setupCardAbilities() {
        this.action('Draw 2 cards, then discard 2 cards')
            .gameAction(sequential([
                draw(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                })),
                chosenDiscard(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ]))
            .effect('make both players draw 2 cards, then discard 2 cards');
    }
}


export default OracleOfStone;
