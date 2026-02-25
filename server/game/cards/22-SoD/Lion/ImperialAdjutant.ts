import { Players, TargetModes, CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ImperialAdjutant extends DrawCard {
    static id = 'imperial-adjutant';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Move or dishonor a character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: context => context.game.isDuringConflict() && context.source.parent && context.source.parent.isAttacking(),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Move this character to the conflict': AbilityDsl.actions.moveToConflict(context => ({
                            target: context.targets.character
                        })),
                        'Dishonor this character': AbilityDsl.actions.dishonor(context => ({
                            target: context.targets.character
                        }))
                    }
                }
            }
        });
    }
}
