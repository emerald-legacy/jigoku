import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { honorStatusDoesNotModifySkill } from '../../effects.js';
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
            .cost(costs.discardCard({
                location: Location.Hand,
                targets: true
            }))
            .ready()
            .honor()
            .chatText('ready and honor {0}');
    }
}


export default UtakuKamoko;
