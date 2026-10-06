import { CardType, Players } from '../../../Constants.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IntrepidScout extends DrawCard {
    static id = 'intrepid-scout';

    setupCardAbilities() {
        this.conflictAction('Move a character to the conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict());
    }
}
