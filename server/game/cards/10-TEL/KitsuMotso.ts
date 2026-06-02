import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class KitsuMotso extends DrawCard {
    static id = 'kitsu-motso';

    setupCardAbilities() {
        this.action({
            title: 'Move a character in',
            condition: (context) =>
                !!(context.source.isParticipating() &&
                context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default KitsuMotso;
