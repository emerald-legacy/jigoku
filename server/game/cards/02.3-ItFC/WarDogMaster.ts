import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';

function discardedCost(discarded: DrawCard[] | undefined): number {
    return discarded?.[0]?.getCost() ?? 0;
}

class WarDogMaster extends DrawCard {
    static id = 'war-dog-master';

    setupCardAbilities() {
        this.reaction('Gain a +X/+0 bonus')
            .when({
                onConflictDeclared: (event, context) => (event.attackers ?? []).includes(context.source)
            })
            .cost(costs.discardCardsOf(context => context.player.dynastyDeck[0]))
            .cardLastingEffect(context => ({
                effect: modifyMilitarySkill(discardedCost(context.costs.discardCard))
            }))
            .effect('give {0} +{1}{2}', context => [discardedCost(context.costs.discardCard), 'military']);
    }
}


export default WarDogMaster;
