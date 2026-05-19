import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior-2';

    public setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onConflictDeclared: (event, context) =>
                    event.ringFate > 0 && event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: AbilityDsl.actions.placeFate()
        });
    }
}
