import DrawCard from '../../DrawCard.js';

class TeacherOfEmptyThought extends DrawCard {
    static id = 'teacher-of-empty-thought';

    setupCardAbilities() {
        this.action('Draw a card')
            .condition(context => !!(context.source.isParticipating() && context.game.currentConflict && context.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3))
            .draw();
    }
}


export default TeacherOfEmptyThought;
