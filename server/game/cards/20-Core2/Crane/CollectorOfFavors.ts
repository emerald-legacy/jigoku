import { Trait } from '../../../Constants.js';
import { gainAbility } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class CollectorOfFavors extends DrawCard {
    static id = 'collector-of-favors';

    setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Courtier });

        this.whileAttached({
            effect: gainAbility.reaction('Gain 1 fate', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                })
                .gainFate())
        });
    }
}
