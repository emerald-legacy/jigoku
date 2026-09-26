import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class ShiotomeEncampment extends DrawCard {
    static id = 'shiotome-encampment';

    setupCardAbilities() {
        this.action('Ready a Cavalry character')
            .condition(context =>
                Object.values(this.game.rings).some(
                    ring =>
                        ring.isConsideredClaimed(context.player) &&
                        ring.isConflictType(ConflictType.Military)
                ))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('cavalry')
            }, AbilityDsl.actions.ready());
    }
}


export default ShiotomeEncampment;
