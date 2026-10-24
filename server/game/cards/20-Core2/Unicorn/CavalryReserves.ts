import { putIntoConflict } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players, TargetMode, ConflictType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CavalryReserves extends DrawCard {
    static id = 'cavalry-reserves';

    override setupCardAbilities() {
        this.conflictAction('Put Cavalry into play from your discard', { conflictType: ConflictType.Military })
            .targetCards({
                mode: TargetMode.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Cavalry)
            }, putIntoConflict());
    }
}
