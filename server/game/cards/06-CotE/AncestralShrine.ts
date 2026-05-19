import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AncestralShrine extends DrawCard {
    static id = 'ancestral-shrine';

    setupCardAbilities() {
        this.action({
            title: 'Return rings to gain honor',
            cost: AbilityDsl.costs.returnRings(),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            }))
        });
    }
}


export default AncestralShrine;
