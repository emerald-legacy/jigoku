import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Players, CharacterStatus } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { StatusToken } from '../../StatusToken.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class FinalWhisper extends DrawCard {
    static id = 'final-whisper';

    setupCardAbilities() {
        this.reaction({
            title: 'Copy status token',
            when: {
                onStatusTokenGained: (event: EventPayload<EventName.OnStatusTokenGained>, context) =>
                    event.card?.type === CardType.Character && event.card?.controller === context.player.opponent
            },
            target: {
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card: DrawCard, context: AbilityContext) =>
                    card !== (context as TriggeredAbilityContext).event.card && card.controller === ((context as TriggeredAbilityContext).event.card as DrawCard).controller,
                gameAction: AbilityDsl.actions.gainStatusToken((context: AbilityContext) => ({
                    token: (((context as TriggeredAbilityContext).event.token as StatusToken)?.grantedStatus || (context as TriggeredAbilityContext).event.token) as CharacterStatus
                }))
            }
        });
    }
}


export default FinalWhisper;
