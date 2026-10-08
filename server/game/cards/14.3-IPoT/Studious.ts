import DrawCard from '../../DrawCard.js';
import { addKeyword, gainAbility } from '../../effects.js';
import { draw } from '../../GameActions/GameActions.js';

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
            effect: gainAbility.reaction('Draw a card', {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            }, (ability) => ability.gameAction(draw()))
        });
    }
}


export default Studious;
