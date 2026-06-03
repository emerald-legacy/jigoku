import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
export default class AkodoKage extends DrawCard {
    static id = 'akodo-kage';

    setupCardAbilities() {
        this.reaction({
            title: 'Set your opponent\'s dial to equal yours',
            when: {
                onHonorDialsRevealed: (event: EventPayload<EventName.OnHonorDialsRevealed>, context: any) =>
                    event.isHonorBid &&
                    context.player.opponent &&
                    context.player.honorBid < context.player.opponent.honorBid &&
                    context.player.isMoreHonorable()
            },
            gameAction: AbilityDsl.actions.setHonorDial((context: AbilityContext) => ({ value: context.player.showBid }))
        });
    }
}
