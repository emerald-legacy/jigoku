import { msg } from '../../GameChat.js';
import { Location } from '../../Constants.js';
import { breakProvince } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MatsuTsuko2 extends DrawCard {
    static id = 'matsu-tsuko-2';

    override setupCardAbilities() {
        this.reaction('Break the province')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isAttacking() &&
                    context.player.isMoreHonorable() &&
                    event.conflict.getConflictProvinces().some((p) => p.location !== Location.StrongholdProvince)
            })
            .selectAttackedProvince({
                cardCondition: (card) => card.location !== Location.StrongholdProvince,
                message: (context, cards) => msg`${context.player} breaks ${cards}`,
                gameAction: breakProvince()
            })
            .chatText('break an attacked province');
    }
}
