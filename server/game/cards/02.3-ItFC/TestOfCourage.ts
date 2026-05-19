import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class TestOfCourage extends DrawCard {
    static id = 'test-of-courage';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into conflict',
            condition: context => context.player.opponent && context.player.showBid < context.player.opponent.showBid,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('lion'),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.moveToConflict(),
                    AbilityDsl.actions.honor()
                ])
            },
            effect: 'move {0} to the conflict and honor it'
        });
    }
}


export default TestOfCourage;
