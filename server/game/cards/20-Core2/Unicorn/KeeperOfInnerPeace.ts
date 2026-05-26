import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, EventNames } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class KeeperOfInnerPeace extends DrawCard {
    static id = 'keeper-of-inner-peace';

    setupCardAbilities() {
        this.reaction({
            title: 'Add fate to a character',
            when: {
                onMoveFate: (event: EventPayload<EventNames.OnMoveFate>, context) =>
                    !context.source.bowed &&
                    event.context?.source.name !== 'Framework effect' &&
                    event.fate > 0 &&
                    event.origin?.type === CardTypes.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    event.context?.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.placeFate((context: any) => ({ target: context.event.origin }))
        });
    }
}
