import { CardType, Location } from '../../Constants.js';
import { breakProvince, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MatsuTsuko2 extends DrawCard {
    static id = 'matsu-tsuko-2';

    setupCardAbilities() {
        this.reaction('Break the province')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isAttacking() &&
                    context.player.isMoreHonorable() &&
                    event.conflict.getConflictProvinces().some(p => p.location !== Location.StrongholdProvince)
            })
            .gameAction(selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.location !== Location.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: breakProvince()
            })))
            .effect('break an attacked province');
    }
}
