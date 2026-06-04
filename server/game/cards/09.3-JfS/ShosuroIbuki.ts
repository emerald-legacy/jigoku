import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class ShosuroIbuki extends DrawCard {
    static id = 'shosuro-ibuki';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove one fate from each other participating character',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.removeFate(context => ({
                target: context.game.currentConflict?.getParticipants((participant: DrawCard) => participant !== context.source) ?? []
            })),
            effect: 'remove one fate from each other participating character'
        });
    }
}


export default ShosuroIbuki;
