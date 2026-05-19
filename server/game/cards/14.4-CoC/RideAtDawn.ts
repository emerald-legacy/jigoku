import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class RideAtDawn extends DrawCard {
    static id = 'ride-at-dawn';

    setupCardAbilities() {
        this.reaction({
            title: 'Make opponent discard a card',
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player && context.player.opponent && !context.player.opponent.passedDynasty
            },
            gameAction: AbilityDsl.actions.discardAtRandom(context => ({ target: context.player.opponent }))
        });
    }
}


export default RideAtDawn;
