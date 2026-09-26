import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
function discardedCost(discarded: DrawCard[] | undefined): number {
    return discarded?.[0]?.getCost() ?? 0;
}

class WarDogMaster extends DrawCard {
    static id = 'war-dog-master';

    setupCardAbilities() {
        this.reaction('Gain a +X/+0 bonus')
            .when({
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => (event.attackers ?? []).includes(context.source)
            })
            .cost(AbilityDsl.costs.discardCardSpecific(context => context.player.dynastyDeck[0]))
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.modifyMilitarySkill(discardedCost(context.costs.discardCard))
            })))
            .effect('give {0} +{1}{2}', context => [discardedCost(context.costs.discardCard), 'military']);
    }
}


export default WarDogMaster;
