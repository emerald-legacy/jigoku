import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ChildOfThePlains extends DrawCard {
    static id = 'child-of-the-plains';

    setupCardAbilities() {
        this.reaction({
            title: 'Get first action',
            when: {
                onCardRevealed: (event, context) =>
                    context.source.isAttacking() && event.card.isConflictProvince() && event.onDeclaration
            },
            effect: 'get the first action in this conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.gainActionPhasePriority()
            }))
        });
    }
}


export default ChildOfThePlains;
