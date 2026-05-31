import { AbilityTypes, CardTypes, EventNames, Locations, Players } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class GraspOfEarth2 extends DrawCard {
    static id = 'grasp-of-earth-2';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'shugenja' });

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: any, _: any, context: any) => target.controller.hasAffinity('earth', context),
                match: (card: any, source: any) => card === source
            })
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.WouldInterrupt, {
                title: 'Block a character\'s movement to the conflict',
                when: {
                    onMoveToConflict: (event: EventPayload<EventNames.OnMoveToConflict>, context: TriggeredAbilityContext) =>
                        event.card.type === CardTypes.Character && context.source.isParticipating()
                },
                effect: 'deny {1}\'s movement',
                effectArgs: (context: TriggeredAbilityContext) => [context.event.card],
                gameAction: AbilityDsl.actions.cancel()
            })
        });
    }
}
