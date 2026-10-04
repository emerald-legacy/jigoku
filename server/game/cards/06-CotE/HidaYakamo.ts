import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

export default class HidaYakamo extends DrawCard {
    static id = 'hida-yakamo';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => Boolean(context.player.opponent) && context.player.isLessHonorable(),
            effect: AbilityDsl.effects.cardCannot('loseDuels')
        });

        this.persistentEffect({
            condition: (context) =>
                Boolean(context.player.opponent) && context.player.isLessHonorable() && this.game.isDuringConflict(ConflictType.Military),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
