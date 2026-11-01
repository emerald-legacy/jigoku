import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';
import { cardLastingEffect, honor, multiple } from '../../GameActions/GameActions.js';
import { CardType, Players, Trait } from '../../Constants.js';

class SwellOfSeafoam extends DrawCard {
    static id = 'swell-of-seafoam';

    override setupCardAbilities() {
        this.action('Prevent bowing after conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating() && card.hasTrait(Trait.Monk)
            }, multiple([
                cardLastingEffect({
                    effect: doesNotBow()
                }),
                honor((context) => ({
                    target: context.player.isKihoPlayedThisConflict(context, this) ? context.target : []
                }))
            ]))
            .chatText((context) => msg`${context.player.isKihoPlayedThisConflict(context, this) ? 'honor and ' : ''}prevent ${context.chatTarget()} from bowing at the end of the conflict`);
    }
}


export default SwellOfSeafoam;
