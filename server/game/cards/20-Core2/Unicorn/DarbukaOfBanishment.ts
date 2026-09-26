import { Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DarbukaOfBanishment extends DrawCard {
    static id = 'darbuka-of-banishment';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'haveAffinity',
                restricts: 'unlessMeishodo'
            })
        });

        this.action('Return a ring to the unclaimed pool')
            .cost(AbilityDsl.costs.payHonor(1))
            .ringTarget('target', {
                ringCondition: (ring) => ring.isClaimed()
            }, AbilityDsl.actions.returnRing());
    }
}
