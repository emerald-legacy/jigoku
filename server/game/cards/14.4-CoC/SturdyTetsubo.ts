import { perRound } from '../../AbilityLimit.js';
import { gainAbility } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class SturdyTetsubo extends DrawCard {
    static id = 'sturdy-tetsubo';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Make opponent discard 1 card', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        context.player.opponent &&
                        event.conflict.isOnWinningSide(context.source)
                })
                .chosenDiscard()
                .limit(perRound(2)))
        });
    }
}
