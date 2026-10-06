import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Duration } from '../../Constants.js';

class KujirasHireling extends DrawCard {
    static id = 'kujira-s-hireling';

    setupCardAbilities() {
        this.action('+1/+1 or -1/-1')
            .cost(AbilityDsl.costs.payFate())
            .select({}, {
                '+1/+1': cardLastingEffect({
                    effect: modifyBothSkills(1),
                    duration: Duration.UntilEndOfPhase
                }),
                '-1/-1': cardLastingEffect({
                    effect: modifyBothSkills(-1),
                    duration: Duration.UntilEndOfPhase
                })
            })
            .effect('give {0} {1}', context => context.select.toLowerCase())
            .limit(AbilityDsl.limit.unlimitedPerConflict())
            .anyPlayer();
    }
}


export default KujirasHireling;
