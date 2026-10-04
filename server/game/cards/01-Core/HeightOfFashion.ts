import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

class HeightOfFashion extends DrawCard {
    static id = 'height-of-fashion';

    canPlay(context: AbilityContext, playType = 'play'): boolean {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}


export default HeightOfFashion;
