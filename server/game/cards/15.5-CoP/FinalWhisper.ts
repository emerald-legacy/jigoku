import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, EventNames, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class FinalWhisper extends DrawCard {
    static id = 'final-whisper';

    setupCardAbilities() {
        this.reaction({
            title: 'Copy status token',
            when: {
                onStatusTokenGained: (event: EventPayload<EventNames.OnStatusTokenGained>, context: any) =>
                    event.card?.type === CardTypes.Character && event.card?.controller === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card: any, context: any) =>
                    card !== context.event.card && card.controller === context.event.card.controller,
                gameAction: AbilityDsl.actions.gainStatusToken((context: any) => ({
                    token: context.event.token.grantedStatus || context.event.token
                }))
            }
        });
    }
}


export default FinalWhisper;
