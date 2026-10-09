import { CardType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

export default class ShiroYogo extends StrongholdCard {
    static id = 'shiro-yogo';

    setupCardAbilities() {
        this.action('Prevent a character from triggering abilities')
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDishonored
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: cannotTriggerAbilities()
            }))
            .chatText('prevent {0} from triggering their abilities until the end of the phase');
    }
}
