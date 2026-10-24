import { msg } from '../../../GameChat.js';
import { Duration, EffectName, Phase, Players } from '../../../Constants.js';
import { addPlayerFlag } from '../../../effects.js';
import * as costs from '../../../costs/index.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';

const TRIGGERED = 'triggeredPlantedFields';

export default class PlantedFields extends DrawCard {
    static id = 'planted-fields';

    public override setupCardAbilities() {
        this.interrupt('Sacrifice Planted Fields')
            .when({
                onPhaseEnded: (event, context) =>
                    event.phase === Phase.Conflict &&
                    !context.player.getProvinceCardInProvince(context.source.location)?.isBroken
            })
            .cost(costs.sacrificeSelf())
            .if((context) => this.hasTriggered(context))
            .gainHonor((context) => ({ target: context.player, amount: 2 }))
            .otherwise()
            .gainFate((context) => ({ target: context.player, amount: 2 }))
            .draw((context) => ({ target: context.player, amount: 2 }))
            .chatText((context) => msg`${this.hasTriggered(context) ? 'gain 2 honor' : 'gain 2 fate and draw 2 cards'}`)
            .afterwards()
            .playerLastingEffect({
                target: Players.Self,
                duration: Duration.UntilEndOfRound,
                effect: addPlayerFlag(TRIGGERED)
            });
    }

    private hasTriggered(context: AbilityContext): boolean {
        return context.player.getEffects(EffectName.AddFlag).includes(TRIGGERED);
    }
}
