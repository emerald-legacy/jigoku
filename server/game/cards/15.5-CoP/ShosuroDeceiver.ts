import DrawCard from '../../DrawCard.js';
import { gainAllAbilitiesDynamic } from '../../effects.js';

class ShosuroDeceiver extends DrawCard {
    static id = 'shosuro-deceiver';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: gainAllAbilitiesDynamic((card, context) => {
                return context.game.currentConflict?.getParticipants((a) => a.isDishonored && a !== card) ?? [];
            })
        });
    }
}


export default ShosuroDeceiver;
