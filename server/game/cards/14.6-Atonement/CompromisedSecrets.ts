import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { giveHonorToTriggerCost } from '../giveHonorToTriggerCost.js';

class CompromisedSecrets extends DrawCard {
    static id = 'compromised-secrets';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.additionalTriggerCostForCard(() => [giveHonorToTriggerCost(this.controller)])
        });
    }

    canPlay(context: AbilityContext, playType: string = 'play'): boolean {
        return !!(context.player.opponent && context.player.isLessHonorable()) && super.canPlay(context, playType);
    }
}


export default CompromisedSecrets;
