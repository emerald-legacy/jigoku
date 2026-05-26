import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShosuroDeceiver extends DrawCard {
    static id = 'shosuro-deceiver';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.gainAllAbilitiesDynamic((card: any, context: any) => {
                return context.game.currentConflict.getParticipants((a: any) => a.isDishonored && a !== card);
            })
        });
    }
}


export default ShosuroDeceiver;
