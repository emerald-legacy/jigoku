import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AncestralRivalry extends DrawCard {
    static id = 'ancestral-rivalry';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +3/+3 or claim favor',
            condition: context => context.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Give the character +3/+3': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            effect: AbilityDsl.effects.modifyBothSkills(3)
                        })),
                        'Let opponent claim favor': AbilityDsl.actions.claimImperialFavor(context => ({
                            target: context.player
                        }))
                    }
                }
            },
            effect: '{1}{2}{3}{4}{5}{6}',
            effectArgs: (context) => context.selects.select.choice === 'Let opponent claim favor' ? [
                'claim the Imperial Favor',
                '',
                '',
                '',
                '',
                ''
            ] : [
                'give ',
                context.targets.character,
                ' +3',
                'military',
                '/+3',
                'political'
            ]
        });
    }
}
