import { CardType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KyudenKakita extends StrongholdCard {
    static id = 'kyuden-kakita';

    setupCardAbilities() {
        this.reaction('Honor a Character')
            .when({ onDuelFinished: () => true })
            .cost(AbilityDsl.costs.bowSelf())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => context.event.duel?.isInvolved(card) ?? false
            }, AbilityDsl.actions.honor());
    }
}
