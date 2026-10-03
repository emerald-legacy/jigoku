import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class UtakuBattleSteed extends DrawCard {
    static id = 'utaku-battle-steed';

    setupCardAbilities() {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('cavalry')
        });

        this.reaction('Honor attached character')
            .when({
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller &&
                                                   event.conflict.conflictType === 'military'
            })
            .gameAction(AbilityDsl.actions.honor((context) => ({
                target: context.source.parentCharacter ?? []
            })));
    }
}


export default UtakuBattleSteed;
