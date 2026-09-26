import type AbilityDsl from '../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KireiKo extends DrawCard {
    static id = 'kirei-ko';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Bow a character who triggered an ability')
            .when({
                onCardAbilityInitiated: (event: EventPayload<EventName.OnCardAbilityInitiated>, context: TriggeredAbilityContext) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent &&
                    event.ability.isTriggeredAbility()
            })
            .gameAction(ability.actions.bow((context) => ({ target: context.event.card })))
            .cannotBeMirrored();
    }
}


export default KireiKo;
