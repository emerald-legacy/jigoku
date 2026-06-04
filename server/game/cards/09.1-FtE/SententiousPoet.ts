import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Stage } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class SententiousPoet extends DrawCard {
    static id = 'sententious-poet';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSpendFate: (event: EventPayload<EventName.OnSpendFate>, context: AbilityContext) =>
                    event.context?.player === context.player.opponent &&
                    event.amount > 0 &&
                    event.context?.stage === Stage.Cost &&
                    event.context?.ability.isCardPlayed() &&
                    (context.source as DrawCard).isParticipating(),
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context: AbilityContext) =>
                    event.context?.ability.isCardPlayed() &&
                    event.context?.player === context.player.opponent &&
                    event.fate > 0 &&
                    (context.source as DrawCard).isParticipating() &&
                    event.context?.stage === Stage.Cost &&
                    event.recipient?.type === 'ring'
            },
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}


export default SententiousPoet;
