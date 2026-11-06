import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { statusTokensDoNotDecreaseSkill } from '../../effects.js';
import { Location } from '../../Constants.js';

class UtakuKamoko extends DrawCard {
    static id = 'utaku-kamoko';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            effect: statusTokensDoNotDecreaseSkill()
        });
        this.reaction('Ready and honor')
            .when({
                // RRG: a province broken outside conflict resolution is broken by its controller's opponent
                onBreakProvince: (event, context) => event.card.controller === context.player
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
