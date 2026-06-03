import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheCrane extends DrawCard {
    static id = 'way-of-the-crane';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crane'),
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default WayOfTheCrane;
