import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode, CardType, CharacterStatus, ConflictType } from '../../Constants.js';
import { putIntoConflict } from '../../GameActions/GameActions.js';

class DarkResurrection extends DrawCard {
    static id = 'dark-resurrection';

    setupCardAbilities() {
        this.conflictAction('Put characters into play from your discard', { conflictType: ConflictType.Military })
            .targetCards({
                activePromptTitle: 'Choose up to three characters',
                numCards: 3,
                mode: TargetMode.UpTo,
                optional: true,
                cardType: CardType.Character,
                location: [Location.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.type === CardType.Character && (card.printedCost ?? 0) <= 3
            }, putIntoConflict({ status: CharacterStatus.Dishonored }));
    }

    isTemptationsMaho() {
        return true;
    }
}


export default DarkResurrection;

