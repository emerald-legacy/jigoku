import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class BrashSamurai extends DrawCard {
    static id = 'brash-samurai';

    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: context =>
                context.source.isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1,
            gameAction: AbilityDsl.actions.honor()
        });
    }
}


export default BrashSamurai;
