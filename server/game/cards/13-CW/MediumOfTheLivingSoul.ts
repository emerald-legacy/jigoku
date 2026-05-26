import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, CardTypes, EventNames, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MediumOfTheLivingSoul extends DrawCard {
    static id = 'medium-of-the-living-soul';

    setupCardAbilities() {
        this.action({
            title: 'Grant an ability to resolve ring effects',

            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                        title: 'Resolve the Ring Effect',
                        when: {
                            onResolveRingElement: (event: EventPayload<EventNames.OnResolveRingElement>, context: any) => {
                                let val = event.player === context.player && context.source.isParticipating();
                                return val;
                            }
                        },
                        cost: AbilityDsl.costs.removeFateFromSelf(),
                        gameAction: AbilityDsl.actions.resolveRingEffect((context: any) => ({ target: context.event.ring }))
                    })
                }))
            },
            effect: 'give {0} the ability to resolve a ring effect'
        });
    }
}


export default MediumOfTheLivingSoul;
