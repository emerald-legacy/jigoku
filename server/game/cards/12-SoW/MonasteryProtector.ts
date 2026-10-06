import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { fateCostToTarget } from '../../effects.js';

class MonasteryProtector extends DrawCard {
    static id = 'monastery-protector';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.getType() === CardType.Character && card.controller === context?.player && card.hasTrait('tattooed'),
            effect: fateCostToTarget({
                amount: 1,
                cardType: CardType.Event,
                targetPlayer: Players.Opponent
            })
        });
    }
}


export default MonasteryProtector;

