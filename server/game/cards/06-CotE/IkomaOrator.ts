import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaOrator extends DrawCard {
    static id = 'ikoma-orator';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => Boolean(context.player.opponent) && context.player.isMoreHonorable(),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }
}


export default IkomaOrator;
