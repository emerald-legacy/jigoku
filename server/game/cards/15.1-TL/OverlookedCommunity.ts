import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location, TargetMode } from '../../Constants.js';

class OverlookedCommunity extends DrawCard {
    static id = 'overlooked-community';

    setupCardAbilities() {
        this.action({
            title: 'Discard a status token',
            cost: AbilityDsl.costs.returnRings(1),
            target: {
                mode: TargetMode.Token,
                cardType: CardType.Character,
                location: Location.PlayArea,
                gameAction: AbilityDsl.actions.discardStatusToken()
            }
        });
    }
}


export default OverlookedCommunity;
