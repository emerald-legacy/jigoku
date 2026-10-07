import { CardType, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { sendHome } from '../../../GameActions/GameActions.js';

export default class InquisitorsGrove extends StrongholdCard {
    static id = 'inquisitor-s-grove';

    setupCardAbilities() {
        this.action('Attacker moves a character home')
            .cost(costs.bowSelf())
            .condition((context) => context.player.honor >= 9 && context.player.isDefendingPlayer())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardCondition: (card) => card.isAttacking()
            }, sendHome());
    }
}
