import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onConflictDeclared: (event: any, context) => event.ringFate > 0 && event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.placeFate()
        });
    }
}


export default EnlightenedWarrior;
