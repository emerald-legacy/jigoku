import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class FormalInvitation extends DrawCard {
    static id = 'formal-invitation';

    setupCardAbilities() {
        this.attachmentConditions({ cardCondition: (card) => card.glory >= 2 });

        this.action('Move attached character into the conflict')
            .condition(() => this.game.isDuringConflict(ConflictType.Political))
            .moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] }));
    }

}


export default FormalInvitation;
