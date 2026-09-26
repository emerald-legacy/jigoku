import AbilityDsl from '../../../abilitydsl.js';
import { CardType, EventName } from '../../../Constants.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class KeeperOfInnerPeace extends DrawCard {
    static id = 'keeper-of-inner-peace';

    setupCardAbilities() {
        this.reaction('Add fate to a character')
            .when({
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context) =>
                    !context.source.bowed &&
                    event.context?.source.name !== 'Framework effect' &&
                    (event.fate ?? 0) > 0 &&
                    event.origin?.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    event.context?.player === context.player.opponent
            })
            .gameAction(AbilityDsl.actions.placeFate((context) => ({ target: context.event.origin instanceof BaseCard ? context.event.origin : [] })));
    }
}
