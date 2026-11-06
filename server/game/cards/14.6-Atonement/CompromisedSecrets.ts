import DrawCard from '../../DrawCard.js';
import { additionalTriggerCostForCard } from '../../effects.js';
import { giveHonorToTriggerCost } from '../giveHonorToTriggerCost.js';

class CompromisedSecrets extends DrawCard {
    static id = 'compromised-secrets';

    override setupCardAbilities() {
        this.playOnlyIf((context) => !!context.player.opponent && context.player.isLessHonorable());

        this.whileAttached({
            effect: additionalTriggerCostForCard(() => [giveHonorToTriggerCost(this.controller)])
        });
    }
}


export default CompromisedSecrets;
