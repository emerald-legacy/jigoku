import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class IdeMessenger extends DrawCard {
    static id = 'ide-messenger';

    setupCardAbilities() {
        this.action('Move an ally to a conflict')
            .cost(AbilityDsl.costs.payFate(1))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict());
    }
}


export default IdeMessenger;
