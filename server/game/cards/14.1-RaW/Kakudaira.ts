import { Durations, EventNames } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class Kakudaira extends ProvinceCard {
    static id = 'kakudaira';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    onPhaseStarted: (event: EventPayload<EventNames.OnPhaseStarted>, context: any) =>
                        context.source.isFaceup() &&
                        !context.source.isBroken &&
                        context.player.getDynastyCardsInProvince(context.source.location).some((a: any) => a.isFacedown())
                },
                duration: Durations.Persistent,
                message: '{0} reveals {1} due to the constant effect of {2}',
                messageArgs: (effectContext: any) => [
                    effectContext.player,
                    effectContext.player
                        .getDynastyCardsInProvince(effectContext.source.location)
                        .filter((a: any) => a.isFacedown()),
                    effectContext.source
                ],
                gameAction: AbilityDsl.actions.flipDynasty((context) => ({
                    target: context.player
                        .getDynastyCardsInProvince(context.source.location)
                        .filter((a: any) => a.isFacedown())
                }))
            })
        });
    }
}
