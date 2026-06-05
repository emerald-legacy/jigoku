import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, EventName, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MediumOfTheLivingSoul extends DrawCard {
    static id = 'medium-of-the-living-soul';

    setupCardAbilities() {
        this.action({
            title: 'Grant an ability to resolve ring effects',

            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                        title: 'Resolve the Ring Effect',
                        when: {
                            onResolveRingElement: (event: EventPayload<EventName.OnResolveRingElement>, context: TriggeredAbilityContext) => {
                                let val = event.player === context.player && (context.source as DrawCard).isParticipating();
                                return val;
                            }
                        },
                        cost: AbilityDsl.costs.removeFateFromSelf(),
                        gameAction: AbilityDsl.actions.resolveRingEffect((context: AbilityContext) => ({ target: (context as TriggeredAbilityContext).event.ring }))
                    })
                }))
            },
            effect: 'give {0} the ability to resolve a ring effect'
        });
    }
}


export default MediumOfTheLivingSoul;
