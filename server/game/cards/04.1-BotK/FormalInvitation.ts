import { moveToConflict } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class FormalInvitation extends DrawCard {
    static id = 'formal-invitation';

    setupCardAbilities() {
        this.action('Move attached character into the conflict')
            .condition(() => this.game.isDuringConflict(ConflictType.Political))
            .gameAction(moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] })));
    }

    canAttach(card: DrawCard) {
        if(card.getType() === CardType.Character && card.getGlory() < 2) {
            return false;
        }

        return super.canAttach(card);
    }
}


export default FormalInvitation;
