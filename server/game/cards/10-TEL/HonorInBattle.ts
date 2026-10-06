import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class HonorInBattle extends DrawCard {
    static id = 'honor-in-battle';

    setupCardAbilities() {
        this.action('Honor a character')
            .condition((context) => context.player.getClaimedRings().some((ring) => ring.isConflictType(ConflictType.Military)))
            .target({
                cardType: CardType.Character
            }, honor());
    }
}


export default HonorInBattle;
