import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { ConflictType } from '../../Constants.js';

class WayWithWords extends DrawCard {
    static id = 'way-with-words';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Take 1 honor', {
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent &&
                    event.conflict.conflictType === ConflictType.Political
            }, (ability) => ability.takeHonor())
        });
    }
}


export default WayWithWords;
