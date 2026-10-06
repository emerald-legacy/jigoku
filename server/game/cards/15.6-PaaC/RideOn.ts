import DrawCard from '../../DrawCard.js';
import { moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class RideOn extends DrawCard {
    static id = 'ride-on';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('cavalry')
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Move to conflict': moveToConflict(context => ({ target: context.targets.character })),
                'Move home': sendHome(context => ({ target: context.targets.character }))
            });
    }
}


export default RideOn;
