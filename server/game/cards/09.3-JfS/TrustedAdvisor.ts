import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TrustedAdvisor extends DrawCard {
    static id = 'trusted-advisor';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.type === 'ring' &&
                    event.recipient && event.recipient === context.player
            },
            gameAction: AbilityDsl.actions.draw(),
            effect: 'draw a card'
        });
    }
}


export default TrustedAdvisor;
