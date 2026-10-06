import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { placeFate } from '../../GameActions/GameActions.js';

class OneOfTheForgotten extends DrawCard {
    static id = 'one-of-the-forgotten';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: playerCannot({
                cannot: 'placeFateWhenPlayingCharacterFromProvince',
                restricts: 'source'
            })
        });

        this.reaction('Gain fate')
            .when({
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            })
            .gameAction(placeFate());
    }
}


export default OneOfTheForgotten;
