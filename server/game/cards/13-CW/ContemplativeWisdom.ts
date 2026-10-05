import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ContemplativeWisdom extends DrawCard {
    static id = 'contemplative-wisdom';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Give all abilities to another character',

                cost: AbilityDsl.costs.returnRings(1),
                target: {
                    cardType: CardType.Character,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.gainAllAbilities(context.source)
                    }))
                },
                effect: 'give {0} all the printed abilities of {1}',
                effectArgs: (context) => [context.source],
                printedAbility: false
            })
        });
    }
}
