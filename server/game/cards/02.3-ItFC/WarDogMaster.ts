import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

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
            .cost(AbilityDsl.costs.discardCardSpecific(context => context.player.dynastyDeck[0]))
            .gameAction(cardLastingEffect(context => ({
                effect: modifyMilitarySkill(discardedCost(context.costs.discardCard))
            })))
            .effect('give {0} +{1}{2}', context => [discardedCost(context.costs.discardCard), 'military']);
    }
}


export default WarDogMaster;
