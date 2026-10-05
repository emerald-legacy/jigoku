import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { bow, dishonor } from '../../GameActions/GameActions.js';

class ForShame extends DrawCard {
    static id = 'for-shame';

    setupCardAbilities() {
        this.action('Dishonor or bow a character')
            .condition(context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Dishonor this character': dishonor((context) => ({ target: context.targets.character })),
                'Bow this character': bow((context) => ({ target: context.targets.character }))
            });
    }
}


export default ForShame;
