import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class SubdueTheSpirits extends DrawCard {
    static id = 'subdue-the-spirits';

    setupCardAbilities() {
        this.action('Add glory to both skills')
            .condition((context) => this.game.isDuringConflict() && context.player.isMoreHonorable())
            .gameAction(cardLastingEffect((context) => ({
                target: context.game.requireConflict().getCharacters(context.player),
                effect: modifyBothSkills((card) => card.glory)
            })))
            .effect(() => msg`add glory to ${'military'} and ${'political'} skills on participating characters they control`);
    }
}


export default SubdueTheSpirits;
