import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Phases } from '../../Constants.js';

class FeedingAnArmy extends DrawCard {
    static id = 'feeding-an-army';

    setupCardAbilities() {
        this.reaction({
            title: 'Put fate on characters',
            when: {
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            },
            cost: [AbilityDsl.costs.breakProvince({ cardCondition: (card) => card.isFaceup() })],
            gameAction: AbilityDsl.actions.placeFate((context) => ({
                target: context.player.cardsInPlay.filter((card: any) => card.costLessThan(4))
            }))
        });
    }
}


export default FeedingAnArmy;
