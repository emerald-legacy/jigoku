import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
class GiftofAmaterasu extends DrawCard {
    static id = 'gift-of-amaterasu';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext) => event.conflict.winner === context.player && (event.conflict.skillDifference ?? 0) >= 5
            })
            .target('target', {
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self
            }, AbilityDsl.actions.honor())
            .cannotBeMirrored();
    }
}


export default GiftofAmaterasu;
