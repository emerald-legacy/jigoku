import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';
import { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class TheMirrorsGaze extends DrawCard {
    static id = 'the-mirror-s-gaze';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.reaction('Mirror an opponent\'s event')
            .when({
                onCardAbilityTriggered: (event: EventPayload<EventName.OnCardAbilityTriggered>, context: TriggeredAbilityContext) => event.card.type === CardType.Event && !event.ability.cannotBeMirrored &&
                    event.context.player === context.player.opponent && !event.cancelled
            })
            .gameAction(ability.actions.resolveAbility((context) => ({
                target: context.event.card,
                ability: context.event.ability,
                ignoredRequirements: ['cost', 'condition', 'limit'],
                event: context.event.context instanceof TriggeredAbilityContext ? context.event.context.event : undefined
            })));
    }
}


export default TheMirrorsGaze;
