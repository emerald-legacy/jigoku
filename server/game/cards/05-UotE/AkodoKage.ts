import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
export default class AkodoKage extends DrawCard {
    static id = 'akodo-kage';

    setupCardAbilities() {
        this.reaction({
            title: 'Set your opponent\'s dial to equal yours',
            when: {
                onHonorDialsRevealed: (event: EventPayload<EventNames.OnHonorDialsRevealed>, context: any) =>
                    event.isHonorBid &&
                    context.player.opponent &&
                    context.player.honorBid < context.player.opponent.honorBid &&
                    context.player.isMoreHonorable()
            },
            gameAction: AbilityDsl.actions.setHonorDial((context: any) => ({ value: context.player.showBid }))
        });
    }
}
