import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class EffectiveDeception extends ProvinceCard {
    static id = 'effective-deception';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel triggered ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.source.isConflictProvince() && event.context.ability.isTriggeredAbility()
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('cancel the effects of {1}\'s ability', (context) => context.event?.card ?? '');
    }
}
