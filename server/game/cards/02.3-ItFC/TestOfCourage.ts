import DrawCard from '../../DrawCard.js';
import { honor, moveToConflict, sequential } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class TestOfCourage extends DrawCard {
    static id = 'test-of-courage';

    setupCardAbilities() {
        this.action('Move a character into conflict')
            .condition(context => !!(context.player.opponent && context.player.showBid < context.player.opponent.showBid))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('lion')
            }, sequential([
                moveToConflict(),
                honor()
            ]))
            .effect('move {0} to the conflict and honor it');
    }
}


export default TestOfCourage;
