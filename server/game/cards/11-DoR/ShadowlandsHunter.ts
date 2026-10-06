import DrawCard from '../../DrawCard.js';
import { forceConflictUnopposed } from '../../effects.js';

class ShadowlandsHunter extends DrawCard {
    static id = 'shadowlands-hunter';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict?.winner === context.player,
            effect: forceConflictUnopposed()
        });
    }
}


export default ShadowlandsHunter;


