import DrawCard from '../../DrawCard.js';
import { additionalConflict, gainAbility } from '../../effects.js';
import { AbilityType, Players, ConflictType } from '../../Constants.js';

class Shori extends DrawCard {
    static id = 'shori';

    setupCardAbilities() {
        this.attachmentConditions({
            unique: true,
            faction: 'lion'
        });

        this.whileAttached({
            match: (card) => card.hasTrait('champion'),
            effect: gainAbility(AbilityType.Persistent, {
                targetController: Players.Self,
                effect: additionalConflict(ConflictType.Military)
            })
        });
    }
}


export default Shori;
