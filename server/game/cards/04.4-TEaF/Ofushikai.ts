import { cannotParticipateAsAttacker, gainAbility } from '../../effects.js';
import { cardLastingEffect, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class Ofushikai extends DrawCard {
    static id = 'ofushikai';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'phoenix'
        });

        this.whileAttached({
            match: (card) => card.hasTrait('champion'),
            effect: gainAbility.action('Send a character home', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isParticipating()
                }, sendHome(), cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: cannotParticipateAsAttacker()
                }))
                .chatText('send {0} home and prevent it from attacking this phase'))
        });
    }
}


export default Ofushikai;
