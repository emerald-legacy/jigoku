import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';

class ArmamentArtisan extends DrawCard {
    static id = 'armament-artisan';

    setupCardAbilities() {
        this.reaction('Honor this character')
            .when({
                onCardHonored: (event, context) => event.card.controller === context.player && event.card !== context.source
            })
            .gameAction(honor());
    }
}


export default ArmamentArtisan;
