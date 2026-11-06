import { ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { isClaimedRingOfType } from '../claimedRings.js';
import { CardType, ConflictType, Trait } from '../../Constants.js';

class ShiotomeEncampment extends DrawCard {
    static id = 'shiotome-encampment';

    override setupCardAbilities() {
        this.action('Ready a Cavalry character')
            .ifCondition((context) =>
                Object.values(this.game.rings).some((ring) => isClaimedRingOfType(ring, ConflictType.Military, context.player)))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Cavalry)
            }, ready());
    }
}


export default ShiotomeEncampment;
