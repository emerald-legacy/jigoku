import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ChildOfThePlains extends DrawCard {
    static id = 'child-of-the-plains';

    setupCardAbilities() {
        this.reaction('Get first action')
            .when({
                onCardRevealed: (event, context) =>
                    context.source.isAttacking() && event.card.isConflictProvince() && event.onDeclaration
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.gainActionPhasePriority()
            })))
            .effect('get the first action in this conflict');
    }
}


export default ChildOfThePlains;
