import DrawCard from '../../DrawCard.js';
import { gainActionPhasePriority } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class ChildOfThePlains extends DrawCard {
    static id = 'child-of-the-plains';

    setupCardAbilities() {
        this.reaction('Get first action')
            .when({
                onCardRevealed: (event, context) =>
                    context.source.isAttacking() && event.card.isConflictProvince() && event.onDeclaration
            })
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player,
                effect: gainActionPhasePriority()
            })))
            .effect('get the first action in this conflict');
    }
}


export default ChildOfThePlains;
