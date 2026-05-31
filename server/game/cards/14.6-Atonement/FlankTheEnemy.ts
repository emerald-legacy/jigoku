import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FlankTheEnemy extends DrawCard {
    static id = 'flank-the-enemy';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => !!(context.player.opponent && context.game.isDuringConflict() && context.game.currentConflict?.hasMoreParticipants(context.player, () => true)),
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default FlankTheEnemy;
