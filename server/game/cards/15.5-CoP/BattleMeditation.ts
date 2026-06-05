import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class BattleMeditation extends DrawCard {
    static id = 'battle-meditation';

    setupCardAbilities() {
        this.reaction({
            title: 'draw 3 cards',
            when: {
                onBreakProvince: (event: EventPayload<EventName.OnBreakProvince>, context) => context.game.isDuringConflict() && event.card.owner !== context.player
                    && (context.game.currentConflict?.getParticipants().some(p => p.controller === context.player && p.hasTrait('berserker')) ?? false)
            },
            gameAction: AbilityDsl.actions.draw({
                amount: 3
            }),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}


export default BattleMeditation;
