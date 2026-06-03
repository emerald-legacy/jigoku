import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import CardAbility from '../../../CardAbility.js';
import { CardType, ConflictType, EventName, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const TARGET_CHARACTER = 'character';

function selfDishonorSelect(message: string) {
    return AbilityDsl.actions.selectCard((context: AbilityContext) => ({
        cardType: CardType.Character,
        controller: Players.Self,
        cardCondition: (card: DrawCard) => card.isParticipating(),
        gameAction: AbilityDsl.actions.dishonor(),
        message: message,
        messageArgs: (card: BaseCard) => [context.player, card, context.source]
    }));
}

export default class NaturesWrath extends DrawCard {
    static id = 'nature-s-wrath';

    public setupCardAbilities() {
        this.action({
            title: 'Dishonor or move home a character',
            condition: (context) =>
                context.game.isDuringConflict(ConflictType.Military) &&
                context.player.anyCardsInPlay((card: DrawCard) => card.isParticipating()),
            targets: {
                [TARGET_CHARACTER]: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: TARGET_CHARACTER,
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': AbilityDsl.actions.dishonor((context: AbilityContext) => ({
                            target: context.targets[TARGET_CHARACTER]
                        })),
                        'Move this character home': AbilityDsl.actions.sendHome((context: AbilityContext) => ({
                            target: context.targets[TARGET_CHARACTER]
                        }))
                    }
                }
            },
            then: (context) => {
                if(!context || !context.subResolution) {
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
                            thenCondition: (event: any) =>
                                !!context &&
                                event.origin === context.target &&
                                !event.cancelled &&
                                event.name === EventName.OnCardDishonored,
                            gameAction: AbilityDsl.actions.resolveAbility({
                                ability: (context && context.ability instanceof CardAbility ? context.ability : undefined) as CardAbility,
                                subResolution: true,
                                choosingPlayerOverride: context?.choosingPlayerOverride ?? undefined
                            })
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
            },
            cannotTargetFirst: true,
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
