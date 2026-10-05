import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheUnicorn extends DrawCard {
    static id = 'way-of-the-unicorn';

    setupCardAbilities() {
        this.wouldInterrupt('Keep the first player token')
            .when({
                onPassFirstPlayer: (event, context) => event.player === context.player.opponent
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('keep the first player token')
            .cannotBeMirrored();
    }
}


export default WayOfTheUnicorn;
