import DrawCard from '../../DrawCard.js';
import { draw } from '../../GameActions/GameActions.js';

class TrustedAdvisor extends DrawCard {
    static id = 'trusted-advisor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.type === 'ring' &&
                    event.recipient === context.player
            })
            .gameAction(draw())
            .effect('draw a card');
    }
}


export default TrustedAdvisor;
