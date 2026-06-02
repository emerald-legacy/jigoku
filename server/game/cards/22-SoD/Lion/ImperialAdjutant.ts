import { Players, TargetMode, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ImperialAdjutant extends DrawCard {
    static id = 'imperial-adjutant';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Move or dishonor a character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: context => !!(context.source.parent && context.source.parent.isAttacking()),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.isParticipating()
                },
                select: {
                    mode: TargetMode.Select,
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
