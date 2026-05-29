import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations } from '../../Constants.js';

class Asceticism extends DrawCard {
    static id = 'asceticism';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.player.getNumberOfFacedownProvinces(province => province.location !== Locations.StrongholdProvince) > 1,
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsTriggeredAbilities',
                source: this
            })
        });
    }
}


export default Asceticism;
