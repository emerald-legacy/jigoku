import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class KitsuMotso extends DrawCard {
    static id = 'kitsu-motso';

    setupCardAbilities() {
        this.action('Move a character in')
            .condition((context) =>
                !!(context.source.isParticipating() &&
                context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent
            }, AbilityDsl.actions.moveToConflict());
    }
}


export default KitsuMotso;
