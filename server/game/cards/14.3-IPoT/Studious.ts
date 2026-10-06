import DrawCard from '../../DrawCard.js';
import { addKeyword, gainAbility } from '../../effects.js';
import { draw } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';

class Studious extends DrawCard {
    static id = 'studious';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'scholar'
        });

        this.whileAttached({
            effect: addKeyword('sincerity')
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Draw a card',
                when: {
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: draw()
            })
        });
    }
}


export default Studious;
