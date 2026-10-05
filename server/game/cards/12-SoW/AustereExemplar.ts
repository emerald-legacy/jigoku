import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AustereExemplar extends DrawCard {
    static id = 'austere-exemplar';

    setupCardAbilities() {
        this.action('Take three actions')
            .cost(AbilityDsl.costs.payFateToRing())
            .condition((context) => context.source.isAttacking())
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(3)
            })))
            .effect('take three actions')
            .limit(AbilityDsl.limit.perConflict(1));
    }
}


export default AustereExemplar;
