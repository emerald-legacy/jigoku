import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type CardAbility from '../../CardAbility.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class TheMirrorsGaze extends DrawCard {
    static id = 'the-mirror-s-gaze';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.reaction({
            title: 'Mirror an opponent\'s event',
            when: {
                onCardAbilityTriggered: (event: EventPayload<EventNames.OnCardAbilityTriggered>, context: any) => event.card.type === CardTypes.Event && !(event.context.ability as any).cannotBeMirrored &&
                    event.context.player === context.player.opponent && !event.cancelled
            },
            gameAction: ability.actions.resolveAbility((context: AbilityContext) => ({
                target: (context as TriggeredAbilityContext).event.card as DrawCard,
                ability: ((context as TriggeredAbilityContext).event.context as AbilityContext).ability as CardAbility,
                ignoredRequirements: ['cost', 'condition', 'limit'],
                event: ((context as TriggeredAbilityContext).event.context as TriggeredAbilityContext).event
            }))
        });
    }
}


export default TheMirrorsGaze;
