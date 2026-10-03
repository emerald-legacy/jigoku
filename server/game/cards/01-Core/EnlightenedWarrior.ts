import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onConflictDeclared: (event, context) => (event.ringFate ?? 0) > 0 && event.conflict.attackingPlayer === context.player.opponent
            })
            .gameAction(AbilityDsl.actions.placeFate());
    }
}


export default EnlightenedWarrior;
