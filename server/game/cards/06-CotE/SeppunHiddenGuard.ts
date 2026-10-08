import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cancel, discardAtRandom, multiple } from '../../GameActions/GameActions.js';

class SeppunHiddenGuard extends DrawCard {
    static id = 'seppun-hidden-guard';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardType.Character &&
                    event.cardTargets.some(
                        (card) =>
                            card.isUnique() &&
                            card.controller === context.player &&
                            card.location === Location.PlayArea
                    )
            })
            .cost(costs.sacrificeSelf())
            .gameAction(multiple([
                cancel(),
                discardAtRandom((context) => ({ target: context.event.context.player }))
            ]))
            .chatText('cancel the effects of {1}, and force {2} to discard a card at random', (context) => [context.event.card, context.event.context.player]);
    }
}


export default SeppunHiddenGuard;
