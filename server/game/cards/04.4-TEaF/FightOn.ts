import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class FightOn extends DrawCard {
    static id = 'fight-on';

    setupCardAbilities() {
        this.action({
            title: 'Ready character and move to conflict',
            condition: context => context.player.isDefendingPlayer(),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.bowed,
                gameAction: [AbilityDsl.actions.ready(), AbilityDsl.actions.moveToConflict()]
            },
            effect: 'ready {0} and move it into the conflict'
        });
    }
}


export default FightOn;
