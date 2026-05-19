import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes } from '../../Constants.js';

class Studious extends DrawCard {
    static id = 'studious';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'scholar'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Draw a card',
                when: {
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: AbilityDsl.actions.draw()
            })
        });
    }
}


export default Studious;
