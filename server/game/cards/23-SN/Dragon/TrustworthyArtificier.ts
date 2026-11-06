import DrawCard from '../../../DrawCard.js';

export default class TrustworthyArtificier extends DrawCard {
    static id = 'trustworthy-artificier';

    override setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.isRing() &&
                    event.recipient && event.recipient === context.player
            })
            .draw();
    }
}
