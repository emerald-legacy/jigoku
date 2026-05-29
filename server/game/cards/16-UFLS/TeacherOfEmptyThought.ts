import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TeacherOfEmptyThought extends DrawCard {
    static id = 'teacher-of-empty-thought';

    setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            condition: context => !!(context.source.isParticipating() && context.game.currentConflict && context.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3),
            gameAction: AbilityDsl.actions.draw()
        });
    }
}


export default TeacherOfEmptyThought;
