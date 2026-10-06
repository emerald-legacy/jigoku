import AbilityDsl from '../../../abilitydsl.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class RogueUnderstudy extends DrawCard {
    static id = 'rogue-understudy';

    setupCardAbilities() {
        this.action('Lose 1 honor to ready me')
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(ready());
    }
}
