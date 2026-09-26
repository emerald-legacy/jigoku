import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, ConflictType } from '../../Constants.js';
import type Ring from '../../Ring.js';

class HonorInBattle extends DrawCard {
    static id = 'honor-in-battle';

    setupCardAbilities() {
        this.action('Honor a character')
            .condition((context) => context.player.getClaimedRings().some((ring: Ring) => ring.isConflictType(ConflictType.Military)))
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.honor());
    }
}


export default HonorInBattle;
