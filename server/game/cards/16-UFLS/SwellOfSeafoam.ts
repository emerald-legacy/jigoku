import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';
import { cardLastingEffect, honor, multiple } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class SwellOfSeafoam extends DrawCard {
    static id = 'swell-of-seafoam';

    setupCardAbilities() {
        this.action('Prevent bowing after conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            }, multiple([
                cardLastingEffect({
                    effect: doesNotBow()
                }),
                honor((context) => ({
                    target: context.player.isKihoPlayedThisConflict(context, this) ? context.target : []
                }))
            ]))
            .effect('{1}prevent {0} from bowing at the end of the conflict', (context) => [context.player.isKihoPlayedThisConflict(context, this) ? 'honor and ' : '']);
    }
}


export default SwellOfSeafoam;
