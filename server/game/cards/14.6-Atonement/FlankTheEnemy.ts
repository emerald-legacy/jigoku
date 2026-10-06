import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class FlankTheEnemy extends DrawCard {
    static id = 'flank-the-enemy';

    setupCardAbilities() {
        this.action('Bow a character')
            .condition(context => !!(context.player.opponent && context.game.currentConflict?.hasMoreParticipants(context.player)))
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, bow());
    }
}


export default FlankTheEnemy;
