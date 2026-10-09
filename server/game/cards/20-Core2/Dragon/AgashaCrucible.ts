import { msg } from '../../../GameChat.js';
import type { ChooseActionOption } from '../../../GameActions/ChooseGameAction.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import { addTrait, additionalAction } from '../../../effects.js';
import { cardLastingEffect, chooseAction, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const options: Record<string, ChooseActionOption> = Object.fromEntries(
    ['Air', 'Earth', 'Fire', 'Void', 'Water'].map((option) => [
        option,
        {
            message: (_context, target) => msg`${target} gains the ${option} Trait`,
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
                choices: options,
                activePromptTitle: 'Choose Trait to gain'
            }))
            .chatText('give {0} another Elemental Trait, and take another action');
    }
}
