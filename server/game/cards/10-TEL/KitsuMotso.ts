import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, Players } from '../../Constants';

class KitsuMotso extends DrawCard {
    static id = 'kitsu-motso';

    setupCardAbilities() {
        this.action({
            title: 'Move a character in',
            condition: (context) =>
                context.source.isParticipating() &&
                context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default KitsuMotso;
