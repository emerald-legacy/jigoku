import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { switchConflictType } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';

class Shukujo extends DrawCard {
    static id = 'shukujo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crane'
        });

        this.whileAttached({
            match: (card) => card.hasTrait('champion'),
            effect: gainAbility(AbilityType.Action, {
                title: 'Switch the conflict type',
                condition: (context) => context.source.isParticipating(),
                printedAbility: false,
                effect: 'switch the conflict type',
                gameAction: switchConflictType()
            })
        });
    }
}


export default Shukujo;
