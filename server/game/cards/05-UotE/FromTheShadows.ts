import { putIntoConflict } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';

class FromTheShadows extends DrawCard {
    static id = 'from-the-shadows';

    setupCardAbilities() {
        this.action('Put a shinobi character into the conflict from hand or a province, dishonored')
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi')
            }, putIntoConflict({ status: 'dishonored' }));
    }

    canPlay(context: AbilityContext, type: string): boolean {
        return !!context.player.opponent && context.player.isLessHonorable() && super.canPlay(context, type);
    }
}


export default FromTheShadows;
