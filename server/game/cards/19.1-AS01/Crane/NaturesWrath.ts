import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { dishonor, selectCard, sendHome } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, EventName, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { Event } from '../../../Events/Event.js';
import { resolveAbilityAgain } from '../../resolveAgain.js';

const TARGET_CHARACTER = 'character';

function selfDishonorSelect(message: string) {
    return selectCard((context: AbilityContext) => ({
        cardType: CardType.Character,
        controller: Players.Self,
        cardCondition: (card) => card.isParticipating(),
        gameAction: dishonor(),
        message: message,
        messageArgs: (card) => [context.player, card, context.source]
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
            .then((context) => {
                if(!context.subResolution) {
                    return {
                        target: {
                            mode: TargetMode.Select,
                            choices: {
                                'Dishonor a participating character to resolve this ability again': selfDishonorSelect(
                                    '{0} chooses to dishonor {1} to resolve {2} again'
                                ),
                                Done: () => true
                            }
                        },
                        then: {
                            thenCondition: (event: Event) => !event.cancelled && event.name === EventName.OnCardDishonored,
                            gameAction: resolveAbilityAgain(context)
                        }
                    };
                }
                return {
                    target: {
                        mode: TargetMode.Select,
                        choices: {
                            'Dishonor a participating character for no effect': selfDishonorSelect(
                                '{0} chooses to dishonor {1} for no effect'
                            ),
                            Done: () => true
                        }
                    }
                };
            })
            .cannotTargetFirst()
            .max(AbilityDsl.limit.perConflict(1));
    }
}
