import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class RideOn extends DrawCard {
    static id = 'ride-on';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('cavalry')
            })
            .select('select', {
                dependsOn: 'character'
            }, {
                'Move to conflict': AbilityDsl.actions.moveToConflict(context => ({ target: context.targets.character })),
                'Move home': AbilityDsl.actions.sendHome(context => ({ target: context.targets.character }))
            });
    }
}


export default RideOn;
