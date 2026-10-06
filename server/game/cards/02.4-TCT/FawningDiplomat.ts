import { claimImperialFavor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class FawningDiplomat extends DrawCard {
    static id = 'fawning-diplomat';

    setupCardAbilities() {
        this.interrupt('Claim Imperial favor')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .gameAction(claimImperialFavor(context => ({
                target: context.player
            })))
            .effect('claim the Emperor\'s favor as she leaves play');
    }
}


export default FawningDiplomat;
