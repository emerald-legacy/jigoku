import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class FormalInvitation extends DrawCard {
    static id = 'formal-invitation';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move attached character into the conflict',
            condition: () => this.game.isDuringConflict('political'),
            gameAction: ability.actions.moveToConflict((context: AbilityContext<this>) => ({ target: context.source.parent as DrawCard }))
        });
    }

    canAttach(card: DrawCard) {
        if(card.getType() === CardType.Character && card.getGlory() < 2) {
            return false;
        }

        return super.canAttach(card);
    }
}


export default FormalInvitation;
