import DrawCard from '../../drawcard.js';
import { Phases } from '../../Constants.js';

class ForgottenLibrary extends DrawCard {
    static id = 'forgotten-library';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card',
            when: {
                onPhaseStarted: event => event.phase === Phases.Draw
            },
            gameAction: ability.actions.draw()
        });
    }
}


export default ForgottenLibrary;
