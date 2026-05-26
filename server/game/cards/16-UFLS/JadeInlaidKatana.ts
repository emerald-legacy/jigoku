import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, CardTypes, EventNames, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class JadeInlaidKatana extends DrawCard {
    static id = 'jade-inlaid-katana';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Remove 1 fate from a character',
                printedAbility: false,
                when: {
                    afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: any) =>
                        context.source.isParticipating() && event.conflict.winner === context.source.controller
                },
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card: any) => {
                        return card.hasStatusTokens && card.isParticipating();
                    },
                    gameAction: AbilityDsl.actions.removeFate()
                }
            })
        });
    }
}


export default JadeInlaidKatana;
