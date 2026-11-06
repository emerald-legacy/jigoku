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
                cardCondition: (card, context) =>
                    !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    (card.isTainted || card.hasTrait(Trait.Corrupt))
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: (context) => context.targets.character.controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Sacrifice this character': sacrifice((context) => ({ target: context.targets.character })),
                // you cannot give yourself honor: with your own character, only the sacrifice is left
                'Give opponent 2 honor': takeHonor((context) => ({
                    amount: 2,
                    target: context.targets.character.controller === context.player ? [] : context.player.opponent
                }))
            });
    }
}
