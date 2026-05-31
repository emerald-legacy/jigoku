import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class FormalInvitation extends DrawCard {
    static id = 'formal-invitation';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move attached character into the conflict',
            condition: () => this.game.isDuringConflict('political'),
            gameAction: ability.actions.moveToConflict((context: any) => ({ target: context.source.parent }))
        });
    }

    canAttach(card: DrawCard) {
        if(card.getType() === CardTypes.Character && card.getGlory() < 2) {
            return false;
        }

        return super.canAttach(card);
    }
}


export default FormalInvitation;
