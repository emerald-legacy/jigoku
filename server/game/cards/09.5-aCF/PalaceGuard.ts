import DrawCard from '../../DrawCard.js';
import { cannotBeDeclaredAsAttacker } from '../../effects.js';

class PalaceGuard extends DrawCard {
    static id = 'palace-guard';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!context.player.opponent && context.player.opponent.isLessHonorable(),
            effect: cannotBeDeclaredAsAttacker()
        });
    }
}


export default PalaceGuard;
