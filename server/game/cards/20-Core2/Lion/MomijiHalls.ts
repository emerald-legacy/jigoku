import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type DrawCard from '../../../drawcard.js';

export default class MomijiHalls extends StrongholdCard {
    static id = 'momiji-halls';

    setupCardAbilities() {
        this.action({
            title: 'Draw 2 cards',
            condition: (context) => context.player.cardsInPlay.some((card: DrawCard) => card.isAttacking('military')),
            cost: [AbilityDsl.costs.bowSelf(), AbilityDsl.costs.discardCard()],
            gameAction: AbilityDsl.actions.draw({ amount: 2 })
        });
    }
}
