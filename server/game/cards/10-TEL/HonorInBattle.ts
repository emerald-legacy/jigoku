import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, ConflictTypes } from '../../Constants.js';
import type Ring from '../../Ring.js';

class HonorInBattle extends DrawCard {
    static id = 'honor-in-battle';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            condition: (context) => context.player.getClaimedRings().some((ring: Ring) => ring.isConflictType(ConflictTypes.Military)),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default HonorInBattle;
