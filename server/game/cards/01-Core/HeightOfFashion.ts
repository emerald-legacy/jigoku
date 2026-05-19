import DrawCard from '../../drawcard.js';

class HeightOfFashion extends DrawCard {
    static id = 'height-of-fashion';

    canPlay(context, playType) {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}


export default HeightOfFashion;
