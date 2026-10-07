import DrawCard from '../../DrawCard.js';

class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onConflictDeclared: (event, context) => (event.ringFate ?? 0) > 0 && event.conflict.attackingPlayer === context.player.opponent
            })
            .placeFate();
    }
}


export default EnlightenedWarrior;
