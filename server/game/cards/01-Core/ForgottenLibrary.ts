import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';

class ForgottenLibrary extends DrawCard {
    static id = 'forgotten-library';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Draw
            })
            .draw();
    }
}


export default ForgottenLibrary;
