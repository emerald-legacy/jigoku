import { cannotParticipateAsAttacker, gainAbility } from '../../effects.js';
import { cardLastingEffect, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType, AbilityType } from '../../Constants.js';

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
            effect: gainAbility(AbilityType.Action, {
                title: 'Send a character home',
                condition: (context) => context.source.isParticipating(),
                chatText: 'send {0} home and prevent it from attacking this phase',
                printedAbility: false,
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: [
                        sendHome(),
                        cardLastingEffect({
                            duration: Duration.UntilEndOfPhase,
                            effect: cannotParticipateAsAttacker()
                        })
                    ]
                }
            })
        });
    }
}


export default Ofushikai;
