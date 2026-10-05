import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class HirumaHarrower extends DrawCard {
    static id = 'hiruma-harrower';

    setupCardAbilities() {
        this.reaction('Gain military skill')
            .when({
                onCardLeavesPlay: (event, context) => context.game.isDuringConflict() && event.card.type === CardType.Character
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
            .effect('give itself +2{1}', () => ['military'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}
