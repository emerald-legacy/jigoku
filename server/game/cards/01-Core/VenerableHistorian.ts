import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';

class VenerableHistorian extends DrawCard {
    static id = 'venerable-historian';

    setupCardAbilities() {
        this.action('Honor this character')
            .condition(context => !!(context.source.isParticipating() && context.player.opponent && context.player.isMoreHonorable()))
            .gameAction(honor());
    }
}


export default VenerableHistorian;
