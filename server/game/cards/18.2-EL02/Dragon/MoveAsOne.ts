import DrawCard from '../../../DrawCard.js';
import { Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class MoveAsOne extends DrawCard {
    static id = 'move-as-one';

    setupCardAbilities() {
        this.reaction('Search for kihos')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && (event.attackers ?? []).some(card => card.hasTrait('monk')),
                onDefendersDeclared: (event, context) => event.conflict.defendingPlayer === context.player && (event.defenders ?? []).some(card => card.hasTrait('monk'))
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: 8,
                shuffle: false,
                placeOnBottomInRandomOrder: true,
                cardCondition: card => card.hasTrait('kiho'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top eight cards of their deck for a kiho')
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default MoveAsOne;
