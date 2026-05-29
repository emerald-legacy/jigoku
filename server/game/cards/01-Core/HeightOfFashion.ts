import DrawCard from '../../DrawCard.js';
import { AbilityContext } from '../../AbilityContext.js';

class HeightOfFashion extends DrawCard {
    static id = 'height-of-fashion';

    canPlay(context: AbilityContext, playType: string = 'play'): boolean {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}


export default HeightOfFashion;
