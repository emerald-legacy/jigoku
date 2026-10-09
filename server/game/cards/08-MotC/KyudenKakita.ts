import { CardType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { honor } from '../../GameActions/GameActions.js';

export default class KyudenKakita extends StrongholdCard {
    static id = 'kyuden-kakita';

    setupCardAbilities() {
        this.reaction('Honor a Character')
            .when({ onDuelFinished: () => true })
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => context.event.duel.isInvolved(card)
            }, honor());
    }
}
