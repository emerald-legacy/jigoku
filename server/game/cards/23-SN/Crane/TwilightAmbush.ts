import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { CardType, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { injure } from '../../../GameActions/GameActions.js';

export default class TwilightAmbush extends DrawCard {
    static id = 'twilight-ambush';

    override setupCardAbilities() {
        this.action('Sacrifice dishonored character to injure dishonored one')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDishonored
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDishonored
            }, injure())
            .max(perRound(1))
            .cannotTargetFirst()
            .thenIf((context) => !!context.costs.sacrificeStateWhenChosen?.hasTrait(Trait.Shinobi))
            .injure((context) => ({ target: context.target }))
            .message((context) => msg`${context.target} is injured again because ${context.costs.sacrificeStateWhenChosen} is a Shinobi`);
    }
}
