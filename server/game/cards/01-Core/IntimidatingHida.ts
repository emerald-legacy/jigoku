import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IntimidatingHida extends DrawCard {
    static id = 'intimidating-hida';

    setupCardAbilities() {
        this.reaction('Make opponent lose honor')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            })
            .gameAction(AbilityDsl.actions.loseHonor());
    }
}


export default IntimidatingHida;
