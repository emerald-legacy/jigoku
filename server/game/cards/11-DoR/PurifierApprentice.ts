import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class PurifierApprentice extends DrawCard {
    static id = 'purifier-apprentice';

    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to lose 1 honor',
            when: { afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player },
            gameAction: AbilityDsl.actions.loseHonor()
        });
    }
}


export default PurifierApprentice;
