import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type DrawCard from '../../../DrawCard.js';

export default class MomijiHalls extends StrongholdCard {
    static id = 'momiji-halls';

    setupCardAbilities() {
        this.action('Draw 2 cards')
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.discardCard())
            .condition((context) => context.player.cardsInPlay.some((card: DrawCard) => card.isAttacking('military')))
            .gameAction(AbilityDsl.actions.draw({ amount: 2 }));
    }
}
