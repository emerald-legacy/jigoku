import { CardTypes, Players } from '../../../Constants';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';

export default class InquisitorsGrove extends StrongholdCard {
    static id = 'inquisitor-s-grove';

    setupCardAbilities() {
        this.action({
            title: 'Attacker moves a character home',
            condition: (context) => context.player.honor >= 9 && context.player.isDefendingPlayer(),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
