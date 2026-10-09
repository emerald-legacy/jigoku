import DrawCard from '../../DrawCard.js';

class BrashSamurai extends DrawCard {
    static id = 'brash-samurai';

    setupCardAbilities() {
        this.action('Honor this character')
            .condition((context) =>
                context.source.isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1)
            .honor();
    }
}


export default BrashSamurai;
