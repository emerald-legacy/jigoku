import DrawCard from '../../../DrawCard.js';
import { Location } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { moveCard } from '../../../GameActions/GameActions.js';

class MoveAsOne extends DrawCard {
    static id = 'move-as-one';

    setupCardAbilities() {
        this.reaction('Search for kihos')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && (event.attackers ?? []).some(card => card.hasTrait('monk')),
                onDefendersDeclared: (event, context) => event.conflict.defendingPlayer === context.player && event.defenders.some(card => card.hasTrait('monk'))
            })
            .deckSearch({
                cardsToLookAt: 8,
                shuffle: false,
                placeOnBottomInRandomOrder: true,
                cardCondition: card => card.hasTrait('kiho'),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .effect('look at the top eight cards of their deck for a kiho')
            .max(perConflict(1));
    }
}


export default MoveAsOne;
