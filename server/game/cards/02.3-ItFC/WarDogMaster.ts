import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class WarDogMaster extends DrawCard {
    static id = 'war-dog-master';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => (event.attackers ?? []).includes(context.source)
            },
            cost: AbilityDsl.costs.discardCardSpecific(context => context.player.dynastyDeck[0]),
            effect: 'give {0} +{1}{2}',
            effectArgs: context => [context.costs.discardCard && typeof (context.costs.discardCard as DrawCard[])[0].getCost() === 'number' ? ((context.costs.discardCard as DrawCard[])[0].getCost() ?? 0) : 0, 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.modifyMilitarySkill(
                    context.costs.discardCard && typeof (context.costs.discardCard as DrawCard[])[0].getCost() === 'number' ? ((context.costs.discardCard as DrawCard[])[0].getCost() ?? 0) : 0
                )
            }))
        });
    }
}


export default WarDogMaster;
