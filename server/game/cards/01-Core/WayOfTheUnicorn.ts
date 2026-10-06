import DrawCard from '../../DrawCard.js';
import { cancel } from '../../GameActions/GameActions.js';

class WayOfTheUnicorn extends DrawCard {
    static id = 'way-of-the-unicorn';

    setupCardAbilities() {
        this.wouldInterrupt('Keep the first player token')
            .when({
                onPassFirstPlayer: (event, context) => event.player === context.player.opponent
            })
            .gameAction(cancel())
            .effect('keep the first player token')
            .cannotBeMirrored();
    }
}


export default WayOfTheUnicorn;
