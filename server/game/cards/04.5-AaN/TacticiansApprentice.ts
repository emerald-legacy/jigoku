import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
export default class TacticiansApprentice extends DrawCard {
    static id = 'tactician-s-apprentice';

    public setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onHonorDialsRevealed: (event: EventPayload<EventName.OnHonorDialsRevealed>, context) =>
                    event.isHonorBid &&
                    !!context.player.opponent &&
                    context.player.showBid < context.player.opponent.showBid
            },
            effect: 'draw a card',
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.perPhase(1)
        });
    }
}
