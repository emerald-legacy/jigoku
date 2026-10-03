import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class FallenInBattle extends DrawCard {
    static id = 'fallen-in-battle';

    setupCardAbilities() {
        this.reaction('Discard a character')
            .when({
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   (event.conflict.skillDifference ?? 0) >= 5
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.discardFromPlay())
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default FallenInBattle;
