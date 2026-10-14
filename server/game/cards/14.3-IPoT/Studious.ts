import DrawCard from '../../DrawCard.js';
import { addKeyword, gainAbility } from '../../effects.js';

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
            effect: gainAbility.reaction('Draw a card', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                })
                .draw())
        });
    }
}


export default Studious;
