import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { dishonor, moveToConflict } from '../../GameActions/GameActions.js';

class AlluringPatron extends DrawCard {
    static id = 'alluring-patron';

    setupCardAbilities() {
        this.action('Move or dishonor a character')
            .condition((context) => context.source.isParticipating())
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


export default AlluringPatron;
