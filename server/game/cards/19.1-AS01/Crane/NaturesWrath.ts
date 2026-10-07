import type { AbilityContext } from '../../../AbilityContext.js';
import { perConflict } from '../../../AbilityLimit.js';
import { dishonor, selectCard, sendHome } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const TARGET_CHARACTER = 'character';

function selfDishonorSelect() {
    return selectCard((context: AbilityContext) => ({
        cardType: CardType.Character,
        controller: Players.Self,
        cardCondition: (card) => card.isParticipating(),
        gameAction: dishonor(),
        message: '{0} dishonors {1}',
        messageArgs: (card) => [context.player, card]
    }));
}

export default class NaturesWrath extends DrawCard {
    static id = 'nature-s-wrath';

    public setupCardAbilities() {
        this.action('Dishonor or move home a character')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Military) &&
                context.player.anyCardsInPlay((card) => card.isParticipating())
            )
            .target({
                name: TARGET_CHARACTER,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .select({ name: 'select', dependsOn: TARGET_CHARACTER, player: Players.Opponent }, {
                'Dishonor this character': dishonor((context) => ({
                    target: context.targets[TARGET_CHARACTER]
                })),
                'Move this character home': sendHome((context) => ({
                    target: context.targets[TARGET_CHARACTER]
                }))
            })
            .mayResolveAgain({ cost: selfDishonorSelect(), label: 'Dishonor a participating character' })
            .cannotTargetFirst()
            .max(perConflict(1));
    }
}
