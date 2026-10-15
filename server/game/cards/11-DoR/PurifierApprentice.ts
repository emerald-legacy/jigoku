import DrawCard from '../../DrawCard.js';

class PurifierApprentice extends DrawCard {
    static id = 'purifier-apprentice';

    setupCardAbilities() {
        this.reaction('Force opponent to lose 1 honor')
            .when({ afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player })
            .loseHonor((context) => ({ target: context.player.opponent }));
    }
}


export default PurifierApprentice;
