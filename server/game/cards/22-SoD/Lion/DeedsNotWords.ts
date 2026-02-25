import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DeedsNotWords extends DrawCard {
    static id = 'deeds-not-words';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +2 mil',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, _context) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(_context => ({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: event =>
                                    context.player === event.conflict.winner
                            },
                            gameAction: AbilityDsl.actions.claimImperialFavor(context => ({ target: context.player })),
                            message: '{0} claims the Imperial Favor to the delayed effect of {1}',
                            messageArgs: [context.player, context.source]
                        })
                    }))
                ])
            },
            then: context => ({
                thenCondition: () => context.player.imperialFavor !== '',
                target: {
                    mode: TargetModes.Select,
                    choices: {
                        'Discard the Imperial Favor': AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseImperialFavor(() => ({
                                target: context.player
                            })),
                            AbilityDsl.actions.selectCard(() => ({
                                activePromptTitle: 'Choose a character to give +2 mil',
                                player: Players.Self,
                                controller: Players.Self,
                                cardCondition: (card) => card !== context.target,
                                targets: true,
                                message: '{0} discards the Imperial Favor to give {1} +2{2}',
                                messageArgs: (card) => [context.player, card, 'military'],
                                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                                }))
                            }))
                        ]),
                        'Done': () => true
                    }
                }
            }),
            effect: 'give {0} +2{1}',
            effectArgs: _context => ['miliary']
        });
    }
}
