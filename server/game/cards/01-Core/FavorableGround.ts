import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavorableGround extends DrawCard {
    static id = 'favorable-ground';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.sendHome(), AbilityDsl.actions.moveToConflict());
    }
}


export default FavorableGround;
