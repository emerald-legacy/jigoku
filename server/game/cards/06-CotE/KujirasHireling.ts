import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, Duration } from '../../Constants.js';

class KujirasHireling extends DrawCard {
    static id = 'kujira-s-hireling';

    setupCardAbilities() {
        this.action({
            title: '+1/+1 or -1/-1',
            cost: AbilityDsl.costs.payFate(),
            anyPlayer: true,
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            target: {
                mode: TargetMode.Select,
                choices: {
                    '+1/+1': AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyBothSkills(1),
                        duration: Duration.UntilEndOfPhase
                    }),
                    '-1/-1': AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyBothSkills(-1),
                        duration: Duration.UntilEndOfPhase
                    })
                }
            },
            effect: 'give {0} {1}',
            effectArgs: context => context.select.toLowerCase()
        });
    }
}


export default KujirasHireling;
