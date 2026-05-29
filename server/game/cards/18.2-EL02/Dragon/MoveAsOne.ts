import DrawCard from '../../../DrawCard.js';
import { Locations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class MoveAsOne extends DrawCard {
    static id = 'move-as-one';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for kihos',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && (event.attackers ?? []).some((card: any) => card.hasTrait('monk')),
                onDefendersDeclared: (event, context) => event.conflict.defendingPlayer === context.player && (event.defenders ?? []).some((card: any) => card.hasTrait('monk'))
            },
            effect: 'look at the top eight cards of their deck for a kiho',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 8,
                shuffle: false,
                placeOnBottomInRandomOrder: true,
                cardCondition: card => card.hasTrait('kiho'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}


export default MoveAsOne;
