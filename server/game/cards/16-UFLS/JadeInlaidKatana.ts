import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, EventName, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
class JadeInlaidKatana extends DrawCard {
    static id = 'jade-inlaid-katana';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Remove 1 fate from a character',
                printedAbility: false,
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext<this>) =>
                        context.source.isParticipating() && event.conflict.winner === context.source.controller
                },
                target: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card) => {
                        return card.hasStatusTokens && card.isParticipating();
                    },
                    gameAction: AbilityDsl.actions.removeFate()
                }
            })
        });
    }
}


export default JadeInlaidKatana;
