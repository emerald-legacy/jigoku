import AbilityDsl from '../../abilitydsl.js';
import { placeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class VanguardWarrior extends DrawCard {
    static id = 'vanguard-warrior';

    setupCardAbilities() {
        this.action('Sacrifice to put fate on one character')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target({
                cardType: CardType.Character
            }, placeFate());
    }
}


export default VanguardWarrior;
