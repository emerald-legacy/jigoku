import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';

export default class CastOutTheShadow extends DrawCard {
    static id = 'cast-out-the-shadow';

    setupCardAbilities() {
        this.action('Sacrifice a character or take 2 honor')
            .condition(context => context.game.isDuringConflict())
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating() && (card.isTainted || card.hasSomeTrait('corrupt', 'shadowlands'))
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Sacrifice this character': AbilityDsl.actions.sacrifice((context) => ({ target: context.targets.character })),
                'Give opponent 2 honor': AbilityDsl.actions.takeHonor((context) => ({ target: context.player.opponent, amount: 2 }))
            });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.isCharacterTraitInPlay('shugenja')) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}
