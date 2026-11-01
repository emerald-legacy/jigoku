import { ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Trait } from '../../Constants.js';

class ShiotomeEncampment extends DrawCard {
    static id = 'shiotome-encampment';

    override setupCardAbilities() {
        this.action('Ready a Cavalry character')
            .ifCondition((context) =>
                Object.values(this.game.rings).some(
                    (ring) =>
                        // a contested ring considered claimed (Secluded Shrine) has no type until claimed (ruling #666)
                        ring.isConsideredClaimed(context.player) &&
                        ring.isClaimed() &&
                        ring.isConflictType(ConflictType.Military)
                ))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Cavalry)
            }, ready());
    }
}


export default ShiotomeEncampment;
