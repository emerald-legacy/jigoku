import { msg } from '../../../GameChat.js';
import type { ChooseActionOption } from '../../../GameActions/ChooseGameAction.js';
import { CardType, Duration, Players, Trait } from '../../../Constants.js';
import { addTrait, additionalAction } from '../../../effects.js';
import { cardLastingEffect, chooseAction, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const elementTraits: [string, Trait][] = [['Air', Trait.Air], ['Earth', Trait.Earth], ['Fire', Trait.Fire], ['Void', Trait.Void], ['Water', Trait.Water]];

const options: Record<string, ChooseActionOption> = Object.fromEntries(
    elementTraits.map(([option, trait]) => [
        option,
        {
            message: (_context, target) => msg`${target} gains the ${option} Trait`,
            action: sequential([
                cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: addTrait(trait)
                }),
                playerLastingEffect({
                    target: Players.Self,
                    duration: Duration.UntilPassPriority,
                    effect: additionalAction(1)
                })
            ])
        }
    ])
);

export default class AgashaCrucible extends DrawCard {
    static id = 'agasha-crucible';

    public override setupCardAbilities() {
        this.action('Give Elemental Trait to a Fire Shugenja')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Shugenja)
            }, chooseAction({
                choices: options,
                activePromptTitle: 'Choose Trait to gain'
            }))
            .chatText('give {0} another Elemental Trait, and take another action');
    }
}
