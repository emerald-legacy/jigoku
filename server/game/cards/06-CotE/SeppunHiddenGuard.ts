import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`cancel the effects of ${context.event.card}, and force ${context.event.context.player} to discard a card at random`);
    }
}


export default SeppunHiddenGuard;
