import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { takeHonor } from '../../GameActions/GameActions.js';
import { AbilityType, ConflictType } from '../../Constants.js';

class WayWithWords extends DrawCard {
    static id = 'way-with-words';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Take 1 honor',
                when: {
                    afterConflict: (event, context) =>
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller &&
                        context.player.opponent &&
                        event.conflict.conflictType === ConflictType.Political
                },
                gameAction: takeHonor()
            })
        });
    }
}


export default WayWithWords;
