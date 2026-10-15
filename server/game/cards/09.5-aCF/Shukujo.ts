import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';

class Shukujo extends DrawCard {
    static id = 'shukujo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crane'
        });

        this.whileAttached({
            match: (card) => card.hasTrait(Trait.Champion),
            effect: gainAbility.action('Switch the conflict type', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .switchConflictType()
                .chatText('switch the conflict type'))
        });
    }
}


export default Shukujo;
