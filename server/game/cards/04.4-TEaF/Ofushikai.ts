import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Durations, CardTypes, AbilityTypes } from '../../Constants.js';

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
            effect: ability.effects.gainAbility(AbilityTypes.Action, {
                title: 'Send a character home',
                condition: (context: any) => context.source.isParticipating(),
                effect: 'send {0} home and prevent it from attacking this phase',
                printedAbility: false,
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card: DrawCard) => card.isParticipating(),
                    gameAction: [
                        ability.actions.sendHome(),
                        ability.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfPhase,
                            effect: ability.effects.cannotParticipateAsAttacker()
                        })
                    ]
                }
            })
        });
    }
}


export default Ofushukai;
