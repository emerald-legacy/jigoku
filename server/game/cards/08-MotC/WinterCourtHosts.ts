import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class WinterCourtHosts extends DrawCard {
    static id = 'winter-court-hosts';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => {
                    return context.player.opponent &&
                        event.player === context.player.opponent &&
                        context.source.isParticipating() &&
                        context.player.isMoreHonorable();
                }
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

export default WinterCourtHosts;

