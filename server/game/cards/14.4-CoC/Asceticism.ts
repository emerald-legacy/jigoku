import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { Location } from '../../Constants.js';

class Asceticism extends DrawCard {
    static id = 'asceticism';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.player.getNumberOfFacedownProvinces(province => province.location !== Location.StrongholdProvince) > 1,
            effect: cardCannot({
                cannot: 'target',
                restricts: 'opponentsTriggeredAbilities',
                source: this
            })
        });
    }
}


export default Asceticism;
