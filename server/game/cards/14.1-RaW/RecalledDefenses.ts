import DrawCard from '../../DrawCard.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location, CardType, Players } from '../../Constants.js';

class RecalledDefenses extends DrawCard {
    static id = 'recalled-defenses';

    setupCardAbilities() {
        this.action('Move a card to your stronghold')
            .target({
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.type !== CardType.Province && card !== context.source
            }, moveCard({ destination: Location.StrongholdProvince }))
            .effect('move {1} to their stronghold province', context => [context.target]);
    }
}


export default RecalledDefenses;
