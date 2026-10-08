import { Players, CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { dishonor, moveToConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ImperialAdjutant extends DrawCard {
    static id = 'imperial-adjutant';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.conflictAction('Move or dishonor a character')
            .cost(costs.sacrificeSelf())
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Move this character to the conflict': moveToConflict((context) => ({
                    target: context.targets.character
                })),
                'Dishonor this character': dishonor((context) => ({
                    target: context.targets.character
                }))
            });
    }
}
