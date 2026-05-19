import DrawCard from '../../drawcard.js';

class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onConflictDeclared: (event, context) => event.ringFate > 0 && event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.placeFate()
        });
    }
}


export default EnlightenedWarrior;
