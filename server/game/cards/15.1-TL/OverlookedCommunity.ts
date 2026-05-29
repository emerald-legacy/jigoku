import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Locations, TargetModes } from '../../Constants.js';

class OverlookedCommunity extends DrawCard {
    static id = 'overlooked-community';

    setupCardAbilities() {
        this.action({
            title: 'Discard a status token',
            cost: AbilityDsl.costs.returnRings(1),
            target: {
                mode: TargetModes.Token,
                cardType: CardTypes.Character,
                location: Locations.PlayArea,
                gameAction: AbilityDsl.actions.discardStatusToken()
            }
        });
    }
}


export default OverlookedCommunity;
