import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class FormalInvitation extends DrawCard {
    static id = 'formal-invitation';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move attached character into the conflict',
            condition: () => this.game.isDuringConflict('political'),
            gameAction: ability.actions.moveToConflict(context => ({ target: context.source.parent }))
        });
    }

    canAttach(card) {
        if(card.getType() === CardTypes.Character && card.getGlory() < 2) {
            return false;
        }

        return super.canAttach(card);
    }
}


export default FormalInvitation;
