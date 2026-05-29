import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';

class SwellOfSeafoam extends DrawCard {
    static id = 'swell-of-seafoam';

    setupCardAbilities() {
        this.action({
            title: 'Prevent bowing after conflict',

            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.doesNotBow()
                    }),
                    AbilityDsl.actions.honor((context) => ({
                        target: context.player.isKihoPlayedThisConflict(context, this) ? context.target : []
                    }))
                ])
            },
            effect: '{1}prevent {0} from bowing at the end of the conflict',
            effectArgs: (context) => [context.player.isKihoPlayedThisConflict(context, this) ? 'honor and ' : '']
        });
    }
}


export default SwellOfSeafoam;
