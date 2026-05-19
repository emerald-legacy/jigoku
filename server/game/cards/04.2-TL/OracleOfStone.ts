import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class OracleOfStone extends DrawCard {
    static id = 'oracle-of-stone';

    setupCardAbilities() {
        this.action({
            title: 'Draw 2 cards, then discard 2 cards',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                })),
                AbilityDsl.actions.chosenDiscard(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ]),
            effect: 'make both players draw 2 cards, then discard 2 cards'
        });
    }
}


export default OracleOfStone;
