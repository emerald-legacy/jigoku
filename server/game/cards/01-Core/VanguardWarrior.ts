import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class VanguardWarrior extends DrawCard {
    static id = 'vanguard-warrior';

    setupCardAbilities() {
        this.action({
            title: 'Sacrifice to put fate on one character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.placeFate()
            }
        });
    }
}


export default VanguardWarrior;
