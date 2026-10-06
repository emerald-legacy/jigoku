import { CardType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyGlory } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

export default class IsawaMoriSeido extends StrongholdCard {
    static id = 'isawa-mori-seido';

    setupCardAbilities() {
        this.action('Bow this stronghold')
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                cardType: CardType.Character
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: modifyGlory(2)
            }))
            .effect('give +2 glory to {0} until the end of the phase');
    }
}
