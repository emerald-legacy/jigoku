import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalTriggerCost } from '../../effects.js';
import { CardType, Players } from '../../Constants.js';

class MagistrateOfReason extends DrawCard {
    static id = 'magistrate-of-reason';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: additionalTriggerCost((context) =>
                context.source.type === CardType.Character ? [AbilityDsl.costs.payFateToRing(1)] : []
            )
        });
    }
}


export default MagistrateOfReason;
