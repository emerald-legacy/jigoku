import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Players } from '../../Constants.js';
import { StatusToken } from '../../StatusToken.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class FinalWhisper extends DrawCard {
    static id = 'final-whisper';

    setupCardAbilities() {
        this.reaction('Copy status token')
            .when({
                onStatusTokenGained: (event: EventPayload<EventName.OnStatusTokenGained>, context) =>
                    event.card?.type === CardType.Character && event.card?.controller === context.player.opponent
            })
            .target('target', {
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card !== context.event.card && card.controller === context.event.card.controller
            }, AbilityDsl.actions.gainStatusToken((context) => ({
                token: context.event.token instanceof StatusToken ? context.event.token.grantedStatus : context.event.token
            })));
    }
}


export default FinalWhisper;
