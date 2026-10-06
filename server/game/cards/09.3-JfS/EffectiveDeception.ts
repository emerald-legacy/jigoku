import { ProvinceCard } from '../../ProvinceCard.js';
import { cancel } from '../../GameActions/GameActions.js';

export default class EffectiveDeception extends ProvinceCard {
    static id = 'effective-deception';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel triggered ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.source.isConflictProvince() && event.context.ability.isTriggeredAbility()
            })
            .gameAction(cancel())
            .effect('cancel the effects of {1}\'s ability', (context) => context.event?.card ?? '');
    }
}
