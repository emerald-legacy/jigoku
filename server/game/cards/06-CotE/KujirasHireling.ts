import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class KujirasHireling extends DrawCard {
    static id = 'kujira-s-hireling';

    setupCardAbilities() {
        this.action('+1/+1 or -1/-1')
            .cost(AbilityDsl.costs.payFate())
            .select('target', {

            }, {
                '+1/+1': AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBothSkills(1),
                    duration: Duration.UntilEndOfPhase
                }),
                '-1/-1': AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBothSkills(-1),
                    duration: Duration.UntilEndOfPhase
                })
            })
            .effect('give {0} {1}', context => context.select.toLowerCase())
            .limit(AbilityDsl.limit.unlimitedPerConflict())
            .anyPlayer();
    }
}


export default KujirasHireling;
