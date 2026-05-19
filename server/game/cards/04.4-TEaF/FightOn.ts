import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class FightOn extends DrawCard {
    static id = 'fight-on';

    setupCardAbilities(ability) {
        this.action({
            title: 'Ready character and move to conflict',
            condition: context => context.player.isDefendingPlayer(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.bowed,
                gameAction: [ability.actions.ready(), ability.actions.moveToConflict()]
            },
            effect: 'ready {0} and move it into the conflict'
        });
    }
}


export default FightOn;
