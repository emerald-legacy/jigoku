import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ShosuroDeceiver extends DrawCard {
    static id = 'shosuro-deceiver';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.gainAllAbilitiesDynamic((card: BaseCard, context: AbilityContext) => {
                return context.game.currentConflict?.getParticipants((a: DrawCard) => a.isDishonored && a !== card) ?? [];
            })
        });
    }
}


export default ShosuroDeceiver;
