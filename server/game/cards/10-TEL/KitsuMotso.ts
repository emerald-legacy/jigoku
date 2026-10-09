import DrawCard from '../../DrawCard.js';
import { moveToConflict } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class KitsuMotso extends DrawCard {
    static id = 'kitsu-motso';

    setupCardAbilities() {
        this.action('Move a character in')
            .condition((context) =>
                !!(context.source.isParticipating() &&
                context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent
            }, moveToConflict());
    }
}


export default KitsuMotso;
