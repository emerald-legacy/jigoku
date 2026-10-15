import DrawCard from '../../../DrawCard.js';
import { Location, RemainingCards, Trait } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { moveCard } from '../../../GameActions/GameActions.js';

class MoveAsOne extends DrawCard {
    static id = 'move-as-one';

    setupCardAbilities() {
        this.reaction('Search for kihos')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && (event.attackers ?? []).some((card) => card.hasTrait(Trait.Monk)),
                onDefendersDeclared: (event, context) => event.conflict.defendingPlayer === context.player && event.defenders.some((card) => card.hasTrait(Trait.Monk))
            })
            .deckSearch({
                cardsToLookAt: 8,
                remainingCards: RemainingCards.BottomRandom,
                cardCondition: (card) => card.hasTrait(Trait.Kiho),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText('look at the top eight cards of their deck for a kiho')
            .max(perConflict(1));
    }
}


export default MoveAsOne;
