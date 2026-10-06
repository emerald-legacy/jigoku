import DrawCard from '../../DrawCard.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location, CardType, Players } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class RecalledDefenses extends DrawCard {
    static id = 'recalled-defenses';

    setupCardAbilities() {
        this.action('Move a card to your stronghold')
            .target({
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.type !== CardType.Province && card !== context.source
            }, moveCard({ destination: Location.StrongholdProvince }))
            .effect((context) => msg`move ${context.target} to their stronghold province`);
    }
}


export default RecalledDefenses;
