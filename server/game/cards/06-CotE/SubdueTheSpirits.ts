import DrawCard from '../../DrawCard.js';
import type { Conflict } from '../../Conflict.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class SubdueTheSpirits extends DrawCard {
    static id = 'subdue-the-spirits';

    setupCardAbilities() {
        this.action({
            title: 'Add glory to both skills',
            condition: (context: AbilityContext) => !!(this.game.isDuringConflict() && context.player && context.player.opponent && context.player.isMoreHonorable()),
            gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                target: (context.game.currentConflict as Conflict).getCharacters(context.player),
                effect: AbilityDsl.effects.modifyBothSkills((card) => card.glory)
            })),
            effect: 'add glory to {1} and {2} skills on participating characters they control',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default SubdueTheSpirits;
