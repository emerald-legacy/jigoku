import { sacrifice, takeHonor } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType, PlayType } from '../../../Constants.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class CastOutTheShadow extends DrawCard {
    static id = 'cast-out-the-shadow';

    setupCardAbilities() {
        this.conflictAction('Sacrifice a character or take 2 honor')
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && (card.isTainted || card.hasSomeTrait('corrupt', 'shadowlands'))
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

    canPlay(context: AbilityContext, playType?: PlayType) {
        if(!controlsShugenja(context.player)) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}
