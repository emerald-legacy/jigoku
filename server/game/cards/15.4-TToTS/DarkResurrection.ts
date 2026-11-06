import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode, CardType, ConflictType, EntersPlayStatus } from '../../Constants.js';
import { putIntoConflict } from '../../GameActions/GameActions.js';

class DarkResurrection extends DrawCard {
    static id = 'dark-resurrection';

    override setupCardAbilities() {
        this.action('Put characters into play from your discard')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .targetCards({
                activePromptTitle: 'Choose up to three characters',
                numCards: 3,
                mode: TargetMode.UpTo,
                cardType: CardType.Character,
                location: [Location.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.type === CardType.Character && card.costAtMost(3)
            }, putIntoConflict({ status: EntersPlayStatus.Dishonored }));
    }

    override isTemptationsMaho() {
        return true;
    }
}


export default DarkResurrection;

