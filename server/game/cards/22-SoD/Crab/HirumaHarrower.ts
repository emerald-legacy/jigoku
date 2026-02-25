import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class HirumaHarrower extends DrawCard {
    static id = 'hiruma-harrower';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain military skill',
            when: {
                onCardLeavesPlay: (event, context) => context.game.isDuringConflict() && event.card.type === CardTypes.Character
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            effect: 'give itself +2{1}',
            effectArgs: ['military']
        });
    }
}
