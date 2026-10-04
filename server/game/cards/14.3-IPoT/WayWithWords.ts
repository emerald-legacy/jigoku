import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, ConflictType } from '../../Constants.js';

class WayWithWords extends DrawCard {
    static id = 'way-with-words';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Take 1 honor',
                when: {
                    afterConflict: (event, context) =>
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller &&
                        context.player.opponent &&
                        event.conflict.conflictType === ConflictType.Political
                },
                gameAction: AbilityDsl.actions.takeHonor()
            })
        });
    }
}


export default WayWithWords;
