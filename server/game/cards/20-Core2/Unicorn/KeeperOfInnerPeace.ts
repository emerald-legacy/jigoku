import AbilityDsl from '../../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, EventName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class KeeperOfInnerPeace extends DrawCard {
    static id = 'keeper-of-inner-peace';

    setupCardAbilities() {
        this.reaction({
            title: 'Add fate to a character',
            when: {
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context) =>
                    !context.source.bowed &&
                    event.context?.source.name !== 'Framework effect' &&
                    event.fate > 0 &&
                    event.origin?.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    event.context?.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.placeFate((context: AbilityContext) => ({ target: (context as TriggeredAbilityContext).event.origin as DrawCard }))
        });
    }
}
