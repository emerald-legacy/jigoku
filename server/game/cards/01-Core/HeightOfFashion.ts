import DrawCard from '../../DrawCard.js';

class HeightOfFashion extends DrawCard {
    static id = 'height-of-fashion';

    override setupCardAbilities() {
        this.playOnlyIf((context) => !context.game.currentConflict);
    }
}


export default HeightOfFashion;
