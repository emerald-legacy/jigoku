import DrawCard from '../../../DrawCard.js';
import { draw } from '../../../GameActions/GameActions.js';

export default class TrustworthyArtificier extends DrawCard {
    static id = 'trustworthy-artificier';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.type === 'ring' &&
                    event.recipient && event.recipient === context.player
            })
            .gameAction(draw());
    }
}
