import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
export default class TacticiansApprentice extends DrawCard {
    static id = 'tactician-s-apprentice';

    public setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onHonorDialsRevealed: (event: EventPayload<EventName.OnHonorDialsRevealed>, context) =>
                    event.isHonorBid &&
                    !!context.player.opponent &&
                    context.player.showBid < context.player.opponent.showBid
            })
            .gameAction(AbilityDsl.actions.draw())
            .effect('draw a card')
            .limit(AbilityDsl.limit.perPhase(1));
    }
}
