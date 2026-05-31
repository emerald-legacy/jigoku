import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ForgottenLibrary extends DrawCard {
    static id = 'forgotten-library';

    setupCardAbilities(ability: typeof AbilityDsl) {
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
