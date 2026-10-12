import { msg } from '../../GameChat.js';
import { Location } from '../../Constants.js';
import { breakProvince } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class TogashiIchi extends DrawCard {
    static id = 'togashi-ichi';

    setupCardAbilities() {
        this.action('Break the province')
            .condition((context) => {
                const conflict = this.game.currentConflict;
                const opponent = context.player.opponent;
                return !!conflict && !!opponent && context.source.isAttacking() &&
                    conflict.getNumberOfCardsPlayed(context.player) +
                        conflict.getNumberOfCardsPlayed(opponent) >= 10 &&
                    conflict.getConflictProvinces().some((p) => p.location !== Location.StrongholdProvince);
            })
            .selectAttackedProvince({
                cardCondition: (card) => card.location !== Location.StrongholdProvince,
                message: (context, cards) => msg`${context.player} breaks ${cards}`,
                gameAction: breakProvince()
            })
            .chatText('break an attacked province');
    }
}
