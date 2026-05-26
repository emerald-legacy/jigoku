import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class IntimidatingHida extends DrawCard {
    static id = 'intimidating-hida';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Make opponent lose honor',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.loseHonor()
        });
    }
}


export default IntimidatingHida;
