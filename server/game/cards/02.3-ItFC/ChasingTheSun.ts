import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ChasingTheSun extends DrawCard {
    static id = 'chasing-the-sun';

    setupCardAbilities() {
        this.action('Move the conflict to another eligible province')
            .condition(context => context.player.isAttackingPlayer())
            .gameAction(AbilityDsl.actions.selectCard({
                cardType: CardType.Province,
                location: Location.Provinces,
                message: '{0} moves the conflict to {1}',
                messageArgs: (card, player) => [player, card],
                gameAction: AbilityDsl.actions.moveConflict()
            }))
            .effect('move the conflict to another eligible province')
            .cannotBeMirrored();
    }
}


export default ChasingTheSun;
