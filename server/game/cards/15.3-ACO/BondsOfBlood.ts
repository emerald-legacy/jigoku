import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { sendHome } from '../../GameActions/GameActions.js';

class BondsOfBlood extends DrawCard {
    static id = 'bonds-of-blood';

    setupCardAbilities() {
        this.action('Send a character home')
            .cost(costs.dishonor({ cardType: CardType.Character, cardCondition: (card) => card.isParticipating() }))
            .target({
                cardType: CardType.Character
            }, sendHome())
            .sendHome((context) => ({ target: context.costs.dishonor }))
            .chatText('send {1} home', (context) => [context.costs.dishonor === context.target ? [context.target] : [context.target, context.costs.dishonor]])
            .cannotTargetFirst();
    }

    isTemptationsMaho() {
        return true;
    }
}


export default BondsOfBlood;
