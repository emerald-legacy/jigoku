import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes } from '../../Constants.js';

class WayWithWords extends DrawCard {
    static id = 'way-with-words';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Take 1 honor',
                when: {
                    afterConflict: (event: any, context: any) =>
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller &&
                        context.player.opponent &&
                        event.conflict.conflictType === 'political'
                },
                gameAction: AbilityDsl.actions.takeHonor()
            })
        });
    }
}


export default WayWithWords;
