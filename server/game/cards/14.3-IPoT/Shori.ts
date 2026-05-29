import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, Players } from '../../Constants.js';

class Shori extends DrawCard {
    static id = 'shori';

    setupCardAbilities() {
        this.attachmentConditions({
            unique: true,
            faction: 'lion'
        });

        this.whileAttached({
            match: (card) => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                targetController: Players.Self,
                effect: AbilityDsl.effects.additionalConflict('military')
            })
        });
    }
}


export default Shori;
