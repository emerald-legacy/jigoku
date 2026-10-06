import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { discardStatusToken } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class OverlookedCommunity extends DrawCard {
    static id = 'overlooked-community';

    setupCardAbilities() {
        this.action('Discard a status token')
            .cost(AbilityDsl.costs.returnRings(1))
            .tokenTarget({
                cardType: CardType.Character,
                location: Location.PlayArea
            }, discardStatusToken());
    }
}


export default OverlookedCommunity;
