import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MasterOfJade extends DrawCard {
    static id = 'master-of-jade';

    setupCardAbilities() {
        this.action({
            title: 'Lose 2 honor to put a fate on a character',
            cost: AbilityDsl.costs.payHonor(2),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.placeFate({amount: 1})
            }
        });
    }
}


export default MasterOfJade;
