import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class UtakuKamoko extends DrawCard {
    static id = 'utaku-kamoko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => context.source.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });
        this.reaction({
            title: 'Ready and honor',
            when: {
                onBreakProvince: (event: EventPayload<EventName.OnBreakProvince>, context: any) => context.player.opponent && event.conflict && event.conflict.attackingPlayer === context.player.opponent
            },
            cost: AbilityDsl.costs.discardCard({
                location: Location.Hand,
                targets: true
            }),
            gameAction: [
                AbilityDsl.actions.ready(),
                AbilityDsl.actions.honor()
            ],
            effect: 'ready and honor {0}'
        });
    }
}


export default UtakuKamoko;
