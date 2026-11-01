import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import { gainAbility, gainPrintedAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ContemplativeWisdom extends DrawCard {
    static id = 'contemplative-wisdom';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.action('Give all abilities to another character', (ability) => ability
                .cost(costs.returnRings(1))
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isParticipating()
                }, cardLastingEffect((context) => ({
                    effect: gainPrintedAbilities(context.source)
                })))
                .chatText((context) => msg`give ${context.chatTarget()} all the printed abilities of ${context.source}`))
        });
    }
}
