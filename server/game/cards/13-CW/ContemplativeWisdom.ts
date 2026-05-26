import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, CardTypes } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

export default class ContemplativeWisdom extends DrawCard {
    static id = 'contemplative-wisdom';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Give all abilities to another character',

                cost: AbilityDsl.costs.returnRings(1),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card: any) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect((context: any) => ({
                        effect: AbilityDsl.effects.gainAllAbilities(context.source)
                    }))
                },
                effect: 'give {0} all the printed abilities of {1}',
                effectArgs: (context: any) => [context.source],
                printedAbility: false
            })
        });
    }
}
