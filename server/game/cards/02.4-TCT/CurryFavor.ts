import type AbilityDsl from '../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class CurryFavor extends DrawCard {
    static id = 'curry-favor';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Ready a character')
            .when({
                onReturnHome: (event: EventPayload<EventName.OnReturnHome>, context) => {
                    if(this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length !== 2) {
                        return false;
                    }
                    return !!event.conflict && event.conflict.attackingPlayer === context.player && event.card.controller === context.player && !!event.bowEvent && !event.bowEvent.cancelled;
                }
            })
            .gameAction(ability.actions.ready((context) => ({ target: (context as TriggeredAbilityContext).event.card })))
            .cannotBeMirrored();
    }
}


export default CurryFavor;
