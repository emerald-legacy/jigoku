import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class UtakuKamoko extends DrawCard {
    static id = 'utaku-kamoko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });
        this.reaction('Ready and honor')
            .when({
                onBreakProvince: (event, context) => !!event.conflict && event.conflict.attackingPlayer === context.player.opponent
            })
            .cost(AbilityDsl.costs.discardCard({
                location: Location.Hand,
                targets: true
            }))
            .gameAction(AbilityDsl.actions.ready(), AbilityDsl.actions.honor())
            .effect('ready and honor {0}');
    }
}


export default UtakuKamoko;
