import { AbilityType, CardType, Location, Players } from '../../../Constants.js';
import { gainAbility, reduceCost } from '../../../effects.js';
import { cancel } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class GraspOfEarth2 extends DrawCard {
    static id = 'grasp-of-earth-2';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'shugenja' });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: 1,
                targetCondition: (target, _, context) => target.controller.hasAffinity('earth', context),
                match: (card, source) => card === source
            })
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.WouldInterrupt, {
                title: 'Block a character\'s movement to the conflict',
                when: {
                    onMoveToConflict: (event, context) =>
                        event.card.type === CardType.Character && context.source.isParticipating()
                },
                effect: 'deny {1}\'s movement',
                effectArgs: (context) => [context.event.card],
                gameAction: cancel()
            })
        });
    }
}
