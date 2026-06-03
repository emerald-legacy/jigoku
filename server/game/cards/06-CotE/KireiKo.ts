import type AbilityDsl from '../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KireiKo extends DrawCard {
    static id = 'kirei-ko';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Bow a character who triggered an ability',
            when: {
                onCardAbilityInitiated: (event: EventPayload<EventName.OnCardAbilityInitiated>, context: any) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent &&
                    event.ability.isTriggeredAbility()
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.bow((context: AbilityContext) => ({ target: (context as TriggeredAbilityContext).event.card }))
        });
    }
}


export default KireiKo;
