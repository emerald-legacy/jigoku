import DrawCard from '../../drawcard.js';

class IntimidatingHida extends DrawCard {
    static id = 'intimidating-hida';

    setupCardAbilities(ability) {
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
