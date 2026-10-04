import AbilityDsl from '../../abilitydsl.js';
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
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Send a character home',
                condition: (context) => context.source.isParticipating(),
                effect: 'send {0} home and prevent it from attacking this phase',
                printedAbility: false,
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: [
                        AbilityDsl.actions.sendHome(),
                        AbilityDsl.actions.cardLastingEffect({
                            duration: Duration.UntilEndOfPhase,
                            effect: AbilityDsl.effects.cannotParticipateAsAttacker()
                        })
                    ]
                }
            })
        });
    }
}


export default Ofushikai;
