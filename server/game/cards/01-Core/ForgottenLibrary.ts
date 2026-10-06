import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import { draw } from '../../GameActions/GameActions.js';

class ForgottenLibrary extends DrawCard {
    static id = 'forgotten-library';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onPhaseStarted: event => event.phase === Phases.Draw
            })
            .gameAction(draw());
    }
}


export default ForgottenLibrary;
