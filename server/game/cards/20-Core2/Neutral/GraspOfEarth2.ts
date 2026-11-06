import { msg } from '../../../GameChat.js';
import { CardType, Location, Players, Trait } from '../../../Constants.js';
import { gainAbility, reduceCost } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class GraspOfEarth2 extends DrawCard {
    static id = 'grasp-of-earth-2';

    public override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Shugenja });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                // the affinity of the player playing it, who has this reducer
                amount: (card, player) => player.hasAffinity(Trait.Earth, new AbilityContext({ game: card.game, player, source: card })) ? 1 : 0,
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
