import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

function bonus(context: AbilityContext): number {
    return context.player.getNumberOfOpponentsFaceupProvinces();
}

export default class MotoRaiju extends DrawCard {
    static id = 'moto-raiju';

    setupCardAbilities() {
        this.conflictAction('Get a military skill bonus')
            .cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(bonus(context))
            }))
            .effect((context) => msg`give itself +${bonus(context)}${'military'} until the end of the conflict`);
    }
}
