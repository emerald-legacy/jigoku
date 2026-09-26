import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class TwilightAmbush extends DrawCard {
    static id = 'twilight-ambush';

    setupCardAbilities() {
        this.action('Sacrifice dishonored character to injure dishonored one')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: card => card.isDishonored
            }))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isDishonored
            }, AbilityDsl.actions.injure())
            .then((context) => ({
                message: '{3} is injured again because {4} is a Shinobi',
                messageArgs: () => [context.target, context.costs.sacrificeStateWhenChosen],
                thenCondition: () => !!context.costs.sacrificeStateWhenChosen?.hasTrait('shinobi'),
                gameAction: AbilityDsl.actions.injure({
                    target: context.target
                })
            }))
            .max(AbilityDsl.limit.perRound(1))
            .cannotTargetFirst();
    }
}
