import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class UtakuBattleSteed extends DrawCard {
    static id = 'utaku-battle-steed';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });

        this.reaction({
            title: 'Honor attached character',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller &&
                                                   event.conflict.conflictType === 'military'
            },
            gameAction: ability.actions.honor((context: AbilityContext<this>) => ({
                target: context.source.parentCharacter ?? []
            }))
        });
    }
}


export default UtakuBattleSteed;
