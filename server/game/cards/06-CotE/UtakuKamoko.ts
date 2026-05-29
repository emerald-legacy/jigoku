import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventNames, Locations } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class UtakuKamoko extends DrawCard {
    static id = 'utaku-kamoko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: any) => context.source.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });
        this.reaction({
            title: 'Ready and honor',
            when: {
                onBreakProvince: (event: EventPayload<EventNames.OnBreakProvince>, context: any) => context.player.opponent && event.conflict && event.conflict.attackingPlayer === context.player.opponent
            },
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand,
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
