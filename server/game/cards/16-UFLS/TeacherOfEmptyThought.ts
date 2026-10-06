import DrawCard from '../../DrawCard.js';
import { draw } from '../../GameActions/GameActions.js';

class TeacherOfEmptyThought extends DrawCard {
    static id = 'teacher-of-empty-thought';

    setupCardAbilities() {
        this.action('Draw a card')
            .condition(context => !!(context.source.isParticipating() && context.game.currentConflict && context.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3))
            .gameAction(draw());
    }
}


export default TeacherOfEmptyThought;
