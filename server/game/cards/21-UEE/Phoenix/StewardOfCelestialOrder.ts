import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class StewardOfCelestialOrder extends DrawCard {
    static id = 'steward-of-celestial-order';

    setupCardAbilities() {
        this.action({
            title: 'Return rings to gain honor',
            cost: AbilityDsl.costs.returnRings(),
            gameAction: AbilityDsl.actions.gainHonor((context) => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            }))
        });
    }
}
