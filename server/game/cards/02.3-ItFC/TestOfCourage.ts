import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class TestOfCourage extends DrawCard {
    static id = 'test-of-courage';

    setupCardAbilities() {
        this.action('Move a character into conflict')
            .condition(context => !!(context.player.opponent && context.player.showBid < context.player.opponent.showBid))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('lion')
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.moveToConflict(),
                AbilityDsl.actions.honor()
            ]))
            .effect('move {0} to the conflict and honor it');
    }
}


export default TestOfCourage;
