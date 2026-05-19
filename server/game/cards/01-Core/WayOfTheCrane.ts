import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class WayOfTheCrane extends DrawCard {
    static id = 'way-of-the-crane';

    setupCardAbilities(ability) {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crane'),
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default WayOfTheCrane;
