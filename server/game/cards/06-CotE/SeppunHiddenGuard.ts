import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardTypes, EventNames, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class SeppunHiddenGuard extends DrawCard {
    static id = 'seppun-hidden-guard';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventNames.OnInitiateAbilityEffects>, context: any) =>
                    event.card.type === CardTypes.Character &&
                    (event.cardTargets ?? []).some(
                        (card: any) =>
                            card.isUnique() &&
                            card.controller === context.player &&
                            card.location === Locations.PlayArea
                    )
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}, and force {2} to discard a card at random',
            effectArgs: (context: AbilityContext) => [(context as TriggeredAbilityContext).event.card as DrawCard, ((context as TriggeredAbilityContext).event.context as AbilityContext).player],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.discardAtRandom((context: AbilityContext) => ({ target: ((context as TriggeredAbilityContext).event.context as AbilityContext).player }))
            ])
        });
    }
}


export default SeppunHiddenGuard;
