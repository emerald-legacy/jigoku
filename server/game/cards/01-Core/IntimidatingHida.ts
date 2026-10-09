import DrawCard from '../../DrawCard.js';

class IntimidatingHida extends DrawCard {
    static id = 'intimidating-hida';

    setupCardAbilities() {
        this.reaction('Make opponent lose honor')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            })
            .loseHonor((context) => ({ target: context.player.opponent }));
    }
}


export default IntimidatingHida;
