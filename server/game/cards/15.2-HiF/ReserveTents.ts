import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class ReserveTents extends DrawCard {
    static id = 'reserve-tents';

    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            limit: AbilityDsl.limit.perRound(2),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                player: Players.Self,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default ReserveTents;
