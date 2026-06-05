import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, Players } from '../../Constants.js';

class Shori extends DrawCard {
    static id = 'shori';

    setupCardAbilities() {
        this.attachmentConditions({
            unique: true,
            faction: 'lion'
        });

        this.whileAttached({
            match: (card: DrawCard) => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityType.Persistent, {
                targetController: Players.Self,
                effect: AbilityDsl.effects.additionalConflict('military')
            })
        });
    }
}


export default Shori;
