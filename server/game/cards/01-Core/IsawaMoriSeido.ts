import { CardType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class IsawaMoriSeido extends StrongholdCard {
    static id = 'isawa-mori-seido';

    setupCardAbilities() {
        this.action('Bow this stronghold')
            .cost(AbilityDsl.costs.bowSelf())
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.modifyGlory(2)
            }))
            .effect('give +2 glory to {0} until the end of the phase');
    }
}
