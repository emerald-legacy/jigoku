import { putIntoConflict } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';

class FromTheShadows extends DrawCard {
    static id = 'from-the-shadows';

    setupCardAbilities() {
        this.action('Put a shinobi character into the conflict from hand or a province, dishonored')
            .playOnlyIf((context) => !!context.player.opponent && context.player.isLessHonorable())
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi')
            }, putIntoConflict({ status: 'dishonored' }));
    }
}


export default FromTheShadows;
