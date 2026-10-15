import { sacrifice, takeHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType, Trait } from '../../../Constants.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class CastOutTheShadow extends DrawCard {
    static id = 'cast-out-the-shadow';

    override setupCardAbilities() {
        this.conflictAction('Sacrifice a character or take 2 honor')
            .playOnlyIf((context) => controlsShugenja(context.player))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && (card.isTainted || card.hasTrait(Trait.Corrupt))
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Sacrifice this character': sacrifice((context) => ({ target: context.targets.character })),
                'Give opponent 2 honor': takeHonor({ amount: 2 })
            });
    }
}
