import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class FourTemplesAdvisor extends DrawCard {
    static id = 'four-temples-advisor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => event.origin && event.origin.type === 'ring' && event.recipient && event.recipient === context.player
            })
            .gameAction(AbilityDsl.actions.draw())
            .effect('draw a card')
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default FourTemplesAdvisor;
