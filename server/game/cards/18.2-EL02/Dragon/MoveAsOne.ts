import DrawCard from '../../../DrawCard.js';
import { Location, RemainingCards, Trait } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

class MoveAsOne extends DrawCard {
    static id = 'move-as-one';

    override setupCardAbilities() {
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
            .chatText((context) => msg`look at the ${topCards(8, context.player.conflictDeck.length, true)} of their deck for a kiho`)
            .max(perConflict(1));
    }
}


export default MoveAsOne;
