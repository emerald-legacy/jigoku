import { msg } from '../../../GameChat.js';
import { CardType, Location, Players, Trait } from '../../../Constants.js';
import { gainAbility, reduceCost } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class GraspOfEarth2 extends DrawCard {
    static id = 'grasp-of-earth-2';

    public override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Shugenja });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: 1,
                targetCondition: (_target, _source, context) => context.player.hasAffinity(Trait.Earth, context),
                match: (card, source) => card === source
            })
        });

        this.whileAttached({
            effect: gainAbility.wouldInterrupt('Block a character\'s movement to the conflict', (ability) => ability
                .when({
                    onMoveToConflict: (event, context) =>
                        event.card.type === CardType.Character && context.source.isParticipating()
                })
                .cancel()
                .chatText((context) => msg`deny ${context.event.card}'s movement`))
        });
    }
}
