import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType, AbilityType } from '../../Constants.js';

class Ofushukai extends DrawCard {
    static id = 'ofushikai';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'phoenix'
        });

        this.whileAttached({
            match: (card: DrawCard) => card.hasTrait('champion'),
            effect: ability.effects.gainAbility(AbilityType.Action, {
                title: 'Send a character home',
                condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating(),
                effect: 'send {0} home and prevent it from attacking this phase',
                printedAbility: false,
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card: DrawCard) => card.isParticipating(),
                    gameAction: [
                        ability.actions.sendHome(),
                        ability.actions.cardLastingEffect({
                            duration: Duration.UntilEndOfPhase,
                            effect: ability.effects.cannotParticipateAsAttacker()
                        })
                    ]
                }
            })
        });
    }
}


export default Ofushukai;
