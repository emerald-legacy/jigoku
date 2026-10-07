import DrawCard from '../../DrawCard.js';

class TrustedAdvisor extends DrawCard {
    static id = 'trusted-advisor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.type === 'ring' &&
                    event.recipient === context.player
            })
            .draw()
            .effect('draw a card');
    }
}


export default TrustedAdvisor;
