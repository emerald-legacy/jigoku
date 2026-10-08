import { CardType, Players, TargetMode, ConflictType } from '../../../Constants.js';
import { moveToConflict, multiple, ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TwentyFourSteps extends DrawCard {
    static id = 'twenty-four-steps';

    public setupCardAbilities() {
        this.conflictAction('Ready a character and move it to the conflict', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi') && card.attachments.length >= 2
            }, multiple([
                ready(),
                moveToConflict()
            ]))
            .chatText('ready {0} and move it into the conflict');

        this.conflictAction('Move two monks to the conflict', { conflictType: ConflictType.Military })
            .targetCards({
                mode: TargetMode.UpTo,
                activePromptTitle: 'Choose characters',
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('monk')
            }, moveToConflict());
    }
}
