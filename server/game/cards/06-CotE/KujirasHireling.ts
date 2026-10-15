import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { unlimited } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Duration } from '../../Constants.js';

class KujirasHireling extends DrawCard {
    static id = 'kujira-s-hireling';

    setupCardAbilities() {
        this.action('+1/+1 or -1/-1')
            .anyPlayer()
            .cost(costs.payFate())
            .select({
                '+1/+1': cardLastingEffect({
                    effect: modifyBothSkills(1),
                    duration: Duration.UntilEndOfPhase
                }),
                '-1/-1': cardLastingEffect({
                    effect: modifyBothSkills(-1),
                    duration: Duration.UntilEndOfPhase
                })
            })
            .chatText((context) => msg`give ${context.chatTarget()} ${context.select.toLowerCase()}`)
            .limit(unlimited());
    }
}


export default KujirasHireling;
