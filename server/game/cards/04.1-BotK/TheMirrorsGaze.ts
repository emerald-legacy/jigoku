import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames } from '../../Constants.js';

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
            gameAction: ability.actions.resolveAbility((context: any) => ({
                target: context.event.card,
                ability: context.event.context.ability,
                ignoredRequirements: ['cost', 'condition', 'limit'],
                event: context.event.context.event
            }))
        });
    }
}


export default TheMirrorsGaze;
