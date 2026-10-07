import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { discardStatusToken } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ExiledGuardian extends DrawCard {
    static id = 'exiled-guardian';

    setupCardAbilities() {
        this.action('Discard a status token off a character or province')
            .cost(costs.sacrificeSelf())
            .tokenTarget({
                cardType: [CardType.Character, CardType.Province],
                location: Location.Any
            }, discardStatusToken())
            .effect((context) => msg`discard ${context.token[0].card}'s ${context.token}`);
    }
}


export default ExiledGuardian;
