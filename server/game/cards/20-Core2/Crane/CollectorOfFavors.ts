import { gainAbility } from '../../../effects.js';
import { gainFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CollectorOfFavors extends DrawCard {
    static id = 'collector-of-favors';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'courtier' });

        this.whileAttached({
            effect: gainAbility.reaction('Gain 1 fate', {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            }, (ability) => ability.gameAction(gainFate()))
        });
    }
}
