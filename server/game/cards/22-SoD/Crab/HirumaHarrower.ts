import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class HirumaHarrower extends DrawCard {
    static id = 'hiruma-harrower';

    setupCardAbilities() {
        this.reaction('Gain military skill')
            .when({
                onCardLeavesPlay: (event, context) => context.game.isDuringConflict() && event.card.type === CardType.Character
            })
            .cardLastingEffect({
                effect: modifyMilitarySkill(2)
            })
            .effect(() => msg`give itself +2${'military'}`)
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}
