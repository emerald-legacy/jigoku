import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { honorStatusDoesNotModifySkill } from '../../effects.js';
import { honor, ready } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class UtakuKamoko extends DrawCard {
    static id = 'utaku-kamoko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            effect: honorStatusDoesNotModifySkill()
        });
        this.reaction('Ready and honor')
            .when({
                onBreakProvince: (event, context) => !!event.conflict && event.conflict.attackingPlayer === context.player.opponent
            })
            .cost(AbilityDsl.costs.discardCard({
                location: Location.Hand,
                targets: true
            }))
            .gameAction(ready(), honor())
            .effect('ready and honor {0}');
    }
}


export default UtakuKamoko;
