import DrawCard from '../../DrawCard.js';
import { Players, CardType, Trait } from '../../Constants.js';
import { bow, dishonor } from '../../GameActions/GameActions.js';
import { controlsParticipating } from '../controlsParticipating.js';

class ForShame extends DrawCard {
    static id = 'for-shame';

    override setupCardAbilities() {
        this.action('Dishonor or bow a character')
            .ifCondition((context) => controlsParticipating(context.player, Trait.Courtier))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
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
