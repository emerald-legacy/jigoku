import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class SubdueTheSpirits extends DrawCard {
    static id = 'subdue-the-spirits';

    setupCardAbilities() {
        this.action('Add glory to both skills')
            .condition((context) => this.game.isDuringConflict() && context.player.isMoreHonorable())
            .cardLastingEffect((context) => ({
                target: context.game.requireConflict().getCharacters(context.player),
                effect: modifyBothSkills((card) => card.glory)
            }))
            .chatText(() => msg`add glory to ${'military'} and ${'political'} skills on participating characters they control`);
    }
}


export default SubdueTheSpirits;
