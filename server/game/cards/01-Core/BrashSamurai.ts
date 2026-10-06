import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';

class BrashSamurai extends DrawCard {
    static id = 'brash-samurai';

    setupCardAbilities() {
        this.action('Honor this character')
            .condition(context =>
                context.source.isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1)
            .gameAction(honor());
    }
}


export default BrashSamurai;
