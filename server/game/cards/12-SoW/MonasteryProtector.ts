import DrawCard from '../../DrawCard.js';
import { Players, CardType, Trait } from '../../Constants.js';
import { fateCostToTarget } from '../../effects.js';

class MonasteryProtector extends DrawCard {
    static id = 'monastery-protector';

    override setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.type === CardType.Character && card.controller === context?.player && card.hasTrait(Trait.Tattooed),
            effect: fateCostToTarget({
                amount: 1,
                cardType: CardType.Event,
                targetPlayer: Players.Opponent
            })
        });
    }
}


export default MonasteryProtector;

