import { cardCannot, doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

export default class HidaYakamo extends DrawCard {
    static id = 'hida-yakamo';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => Boolean(context.player.opponent) && context.player.isLessHonorable(),
            effect: cardCannot('loseDuels')
        });

        this.persistentEffect({
            condition: (context) =>
                Boolean(context.player.opponent) && context.player.isLessHonorable() && this.game.isDuringConflict(ConflictType.Military),
            effect: doesNotBow()
        });
    }
}
