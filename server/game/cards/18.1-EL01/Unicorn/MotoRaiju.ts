import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

function bonus(context: AbilityContext): number {
    return context.player.getNumberOfOpponentsFaceupProvinces();
}

export default class MotoRaiju extends DrawCard {
    static id = 'moto-raiju';

    setupCardAbilities() {
        this.action('Get a military skill bonus')
            .condition((context) => context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(bonus(context))
            })))
            .effect('give itself +{1}{2} until the end of the conflict', (context) => [bonus(context), 'military']);
    }
}
