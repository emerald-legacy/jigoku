import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AlluringPatron extends DrawCard {
    static id = 'alluring-patron';

    setupCardAbilities() {
        this.action('Move or dishonor a character')
            .condition(context => context.source.isParticipating())
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


export default AlluringPatron;
