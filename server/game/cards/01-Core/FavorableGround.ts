import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavorableGround extends DrawCard {
    static id = 'favorable-ground';

    setupCardAbilities(ability: typeof AbilityDsl) {
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
