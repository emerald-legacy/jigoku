import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { PlayType } from '../../Constants.js';

class HeightOfFashion extends DrawCard {
    static id = 'height-of-fashion';

    canPlay(context: AbilityContext, playType?: PlayType): boolean {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}


export default HeightOfFashion;
