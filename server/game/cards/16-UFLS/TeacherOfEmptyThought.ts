import DrawCard from '../../DrawCard.js';

class TeacherOfEmptyThought extends DrawCard {
    static id = 'teacher-of-empty-thought';

    override setupCardAbilities() {
        this.action('Draw a card')
            .condition((context) => context.source.isParticipating())
            .ifCondition((context) => (context.game.currentConflict?.getNumberOfCardsPlayed(context.player) ?? 0) >= 3)
            .draw();
    }
}


export default TeacherOfEmptyThought;
