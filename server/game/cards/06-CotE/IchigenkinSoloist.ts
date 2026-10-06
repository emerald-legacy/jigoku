import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';

class IchigenkinSoloist extends DrawCard {
    static id = 'ichigenkin-soloist';

    setupCardAbilities() {
        this.composure({
            effect: cardCannot({
                cannot: 'target',
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}


export default IchigenkinSoloist;
