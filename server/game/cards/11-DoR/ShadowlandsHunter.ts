import DrawCard from '../../DrawCard.js';
import { forceConflictUnopposed } from '../../effects.js';

class ShadowlandsHunter extends DrawCard {
    static id = 'shadowlands-hunter';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && !!this.game.currentConflict?.isOnWinningSide(context.source),
            effect: forceConflictUnopposed()
        });
    }
}


export default ShadowlandsHunter;


