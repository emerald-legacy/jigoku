import { Duration, EventName } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { AbilityContext } from '../../AbilityContext.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
export default class Kakudaira extends ProvinceCard {
    static id = 'kakudaira';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    onPhaseStarted: (event: EventPayload<EventName.OnPhaseStarted>, context: AbilityContext) =>
                        (context.source as ProvinceCard).isFaceup() &&
                        !(context.source as ProvinceCard).isBroken &&
                        context.player.getDynastyCardsInProvince((context.source as ProvinceCard).location).some((a: DrawCard) => a.isFacedown())
                },
                duration: Duration.Persistent,
                message: '{0} reveals {1} due to the constant effect of {2}',
                messageArgs: (effectContext: AbilityContext) => [
                    effectContext.player,
                    effectContext.player
                        .getDynastyCardsInProvince((effectContext.source as ProvinceCard).location)
                        .filter((a: DrawCard) => a.isFacedown()),
                    effectContext.source
                ],
                gameAction: AbilityDsl.actions.flipDynasty((context) => ({
                    target: context.player
                        .getDynastyCardsInProvince((context.source as ProvinceCard).location)
                        .filter((a: DrawCard) => a.isFacedown())
                }))
            })
        });
    }
}
