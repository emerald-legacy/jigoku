import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes } from '../../Constants.js';

class Shukujo extends DrawCard {
    static id = 'shukujo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crane'
        });

        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Switch the conflict type',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                printedAbility: false,
                effect: 'switch the conflict type',
                gameAction: AbilityDsl.actions.switchConflictType()
            })
        });
    }
}


export default Shukujo;
