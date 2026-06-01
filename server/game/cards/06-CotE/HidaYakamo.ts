import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

export default class HidaYakamo extends DrawCard {
    static id = 'hida-yakamo';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => Boolean(context.player.opponent) && context.player.isLessHonorable(),
            effect: AbilityDsl.effects.cardCannot('loseDuels')
        });

        this.persistentEffect({
            condition: (context: AbilityContext) =>
                Boolean(context.player.opponent) && context.player.isLessHonorable() && this.game.isDuringConflict('military'),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
