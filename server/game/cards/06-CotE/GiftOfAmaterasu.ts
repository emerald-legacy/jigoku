import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
class GiftofAmaterasu extends DrawCard {
    static id = 'gift-of-amaterasu';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext) => event.conflict.winner === context.player && (event.conflict.skillDifference ?? 0) >= 5
            },
            cannotBeMirrored: true,
            target: {
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default GiftofAmaterasu;
