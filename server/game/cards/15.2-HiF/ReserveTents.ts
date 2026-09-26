import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class ReserveTents extends DrawCard {
    static id = 'reserve-tents';

    setupCardAbilities() {
        this.action('Move a character to the conflict')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                player: Players.Self
            }, AbilityDsl.actions.moveToConflict())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default ReserveTents;
