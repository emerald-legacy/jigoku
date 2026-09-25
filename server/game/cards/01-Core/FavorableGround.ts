import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavorableGround extends DrawCard {
    static id = 'favorable-ground';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Move a character into or out of the conflict')
            .cost(ability.costs.sacrificeSelf())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, ability.actions.sendHome(), ability.actions.moveToConflict());
    }
}


export default FavorableGround;
