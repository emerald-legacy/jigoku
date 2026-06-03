import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class AtAnyCost extends DrawCard {
    static id = 'at-any-cost';

    setupCardAbilities() {
        this.action({
            title: 'Place a fate on a character',
            cost: AbilityDsl.costs.payHonor(3),
            target: {
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.placeFate({ amount: 2 })
            }
        });
    }
}


export default AtAnyCost;
