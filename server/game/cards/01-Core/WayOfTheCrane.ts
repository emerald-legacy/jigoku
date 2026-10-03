import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheCrane extends DrawCard {
    static id = 'way-of-the-crane';

    setupCardAbilities() {
        this.action('Honor a character')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crane')
            }, AbilityDsl.actions.honor());
    }
}


export default WayOfTheCrane;
