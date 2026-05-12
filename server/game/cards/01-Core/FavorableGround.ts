import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class FavorableGround extends DrawCard {
    static id = 'favorable-ground';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into or out of the conflict',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
            }
        });
    }
}


export default FavorableGround;
