import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeMessenger extends DrawCard {
    static id = 'ide-messenger';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Move an ally to a conflict')
            .cost(ability.costs.payFate(1))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, ability.actions.moveToConflict());
    }
}


export default IdeMessenger;
