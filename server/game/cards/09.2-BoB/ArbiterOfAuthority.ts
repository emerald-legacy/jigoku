import DrawCard from '../../DrawCard.js';
import { DuelType } from '../../Constants.js';
import { bow, dishonor, multiple, sendHome } from '../../GameActions/GameActions.js';

class ArbiterOfAuthority extends DrawCard {
    static id = 'arbiter-of-authority';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                refuseGameAction: dishonor((context) => ({ target: context.target })),
                gameAction: (duel) => multiple([
                    bow({ target: duel.loser }),
                    sendHome({ target: duel.loser })
                ])
            }));
    }
}


export default ArbiterOfAuthority;
