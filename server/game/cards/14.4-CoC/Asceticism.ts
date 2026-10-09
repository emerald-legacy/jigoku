import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { Location, RestrictionType, RestrictionScope } from '../../Constants.js';

class Asceticism extends DrawCard {
    static id = 'asceticism';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.player.getNumberOfFacedownProvinces((province) => province.location !== Location.StrongholdProvince) > 1,
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsTriggeredAbilities,
                source: this
            })
        });
    }
}


export default Asceticism;
