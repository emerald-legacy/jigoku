import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { cancel, loseFate, sequential } from '../../GameActions/GameActions.js';

class IkebanaArtisan extends DrawCard {
    static id = 'ikebana-artisan';

    setupCardAbilities() {
        this.wouldInterrupt('Lose fate instead of honor')
            .when({
                onModifyHonor: (event, context) => event.dueToUnopposed && event.player === context.player
            })
            .gameAction(sequential([
                cancel(),
                loseFate(context => ({ target: context.player }))
            ]))
            .effect('lose 1 fate rather than 1 honor for not defending the conflict')
            .limit(unlimitedPerConflict());
    }
}


export default IkebanaArtisan;
