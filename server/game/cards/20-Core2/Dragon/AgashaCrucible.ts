import { CardType, Duration, Players } from '../../../Constants.js';
import { addTrait, additionalAction } from '../../../effects.js';
import { cardLastingEffect, chooseAction, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const options = Object.fromEntries(
    ['Air', 'Earth', 'Fire', 'Void', 'Water'].map((option) => [
        option,
        {
            message: `{1} gains the ${option} Trait`,
            action: sequential([
                cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: addTrait(option.toLowerCase())
                }),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilPassPriority,
                    effect: additionalAction(1)
                }))
            ])
        }
    ])
);

export default class AgashaCrucible extends DrawCard {
    static id = 'agasha-crucible';

    public setupCardAbilities() {
        this.action('Give Elemental Trait to a Fire Shugenja')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shugenja')
            }, chooseAction({
                options,
                activePromptTitle: 'Choose Trait to gain'
            }))
            .effect('give {0} another Elemental Trait, and take another action');
    }
}
