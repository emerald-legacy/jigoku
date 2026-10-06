import { CardType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

export default class ShiroYogo extends StrongholdCard {
    static id = 'shiro-yogo';

    setupCardAbilities() {
        this.action('Prevent a character from triggering abilities')
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDishonored
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: cannotTriggerAbilities()
            }))
            .effect('prevent {0} from triggering their abilities until the end of the phase');
    }
}
