import { perRound } from '../../AbilityLimit.js';
import { moveToConflict } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class ReserveTents extends DrawCard {
    static id = 'reserve-tents';

    setupCardAbilities() {
        this.action('Move a character to the conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                player: Players.Self
            }, moveToConflict())
            .limit(perRound(2));
    }
}


export default ReserveTents;
