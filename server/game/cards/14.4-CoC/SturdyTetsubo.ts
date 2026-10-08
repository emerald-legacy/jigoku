import { perRound } from '../../AbilityLimit.js';
import { gainAbility } from '../../effects.js';
import { chosenDiscard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class SturdyTetsubo extends DrawCard {
    static id = 'sturdy-tetsubo';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Make opponent discard 1 card', {
                afterConflict: (event, context) =>
                    context.player.opponent &&
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller
            }, (ability) => ability
                .gameAction(chosenDiscard())
                .limit(perRound(2)))
        });
    }
}
