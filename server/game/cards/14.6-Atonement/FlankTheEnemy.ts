import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FlankTheEnemy extends DrawCard {
    static id = 'flank-the-enemy';

    setupCardAbilities() {
        this.action('Bow a character')
            .condition(context => !!(context.player.opponent && context.game.isDuringConflict() && context.game.currentConflict?.hasMoreParticipants(context.player, () => true)))
            .target('target', {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow());
    }
}


export default FlankTheEnemy;
