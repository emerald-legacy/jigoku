import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class OverlookedCommunity extends DrawCard {
    static id = 'overlooked-community';

    setupCardAbilities() {
        this.action('Discard a status token')
            .cost(AbilityDsl.costs.returnRings(1))
            .tokenTarget('target', {
                cardType: CardType.Character,
                location: Location.PlayArea
            }, AbilityDsl.actions.discardStatusToken());
    }
}


export default OverlookedCommunity;
