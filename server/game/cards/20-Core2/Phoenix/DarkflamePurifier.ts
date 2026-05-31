import { CardTypes, EventNames, Phases, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class DarkflamePurifier extends DrawCard {
    static id = 'darkflame-purifier';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor a character',
            when: {
                onMoveFate: (event: EventPayload<EventNames.OnMoveFate>, context) =>
                    context.game.currentPhase !== Phases.Fate &&
                    event.origin?.type === CardTypes.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player.opponent &&
                    event.fate > 0
            },
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}
