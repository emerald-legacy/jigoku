import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Prevent each player playing cards from hand',
            condition: (context: AbilityContext<this>) => context.source.isParticipating() && context.player.imperialFavor !== '',
            effect: 'prevent each player playing cards from hand',
            gameAction: [
                ability.actions.playerLastingEffect({
                    targetController: Players.Any,
                    effect: ability.effects.playerCannot({
                        cannot: PlayType.PlayFromHand
                    })
                })
            ]
        });
    }
}


export default AkodoToturi2;
