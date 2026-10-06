import DrawCard from '../../DrawCard.js';
import { immunity } from '../../effects.js';
import { ConflictType } from '../../Constants.js';

class ReinforcedPlate extends DrawCard {
    static id = 'reinforced-plate';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.parentCharacter !== null && context.source.parentCharacter !== undefined && context.source.parentCharacter.isParticipating() && this.game.isDuringConflict(ConflictType.Military),
            effect: immunity({
                restricts: 'opponentsEvents'
            })
        });
    }
}


export default ReinforcedPlate;
