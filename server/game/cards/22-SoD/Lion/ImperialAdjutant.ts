import { Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ImperialAdjutant extends DrawCard {
    static id = 'imperial-adjutant';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move or dishonor a character')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.isParticipating()
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Move this character to the conflict': AbilityDsl.actions.moveToConflict(context => ({
                    target: context.targets.character
                })),
                'Dishonor this character': AbilityDsl.actions.dishonor(context => ({
                    target: context.targets.character
                }))
            });
    }
}
