import DrawCard from '../../DrawCard.js';
import { gainActionPhasePriority } from '../../effects.js';

class ChildOfThePlains extends DrawCard {
    static id = 'child-of-the-plains';

    setupCardAbilities() {
        this.reaction('Get first action')
            .when({
                onCardRevealed: (event, context) =>
                    context.source.isAttacking() && event.card.isConflictProvince() && event.onDeclaration
            })
            .playerLastingEffect(context => ({
                targetController: context.player,
                effect: gainActionPhasePriority()
            }))
            .chatText('get the first action in this conflict');
    }
}


export default ChildOfThePlains;
