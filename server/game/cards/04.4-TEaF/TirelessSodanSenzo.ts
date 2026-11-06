import { doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class TirelessSodanSenzo extends DrawCard {
    static id = 'tireless-sodan-senzo';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!this.game.currentConflict?.isOnLosingSide(context.source),
            effect: doesNotBow()
        });
    }
}


export default TirelessSodanSenzo;
