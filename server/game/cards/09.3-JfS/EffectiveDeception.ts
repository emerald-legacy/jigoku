import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class EffectiveDeception extends ProvinceCard {
    static id = 'effective-deception';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel triggered ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.source.isConflictProvince() && event.context.ability.isTriggeredAbility()
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event?.card ?? ''}'s ability`);
    }
}
