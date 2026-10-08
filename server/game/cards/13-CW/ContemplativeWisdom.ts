import * as costs from '../../costs/index.js';
import { gainAbility, gainAllAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { AbilityType, CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ContemplativeWisdom extends DrawCard {
    static id = 'contemplative-wisdom';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Give all abilities to another character',

                cost: costs.returnRings(1),
                target: {
                    cardType: CardType.Character,
                    cardCondition: card => card.isParticipating(),
                    gameAction: cardLastingEffect((context) => ({
                        effect: gainAllAbilities(context.source)
                    }))
                },
                chatText: 'give {0} all the printed abilities of {1}',
                chatTextArgs: (context) => [context.source],
                printedAbility: false
            })
        });
    }
}
