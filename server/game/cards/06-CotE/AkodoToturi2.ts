import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayTypes } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Prevent each player playing cards from hand',
            condition: (context: any) => context.source.isParticipating() && context.player.imperialFavor !== '',
            effect: 'prevent each player playing cards from hand',
            gameAction: [
                ability.actions.playerLastingEffect({
                    targetController: Players.Any,
                    effect: ability.effects.playerCannot({
                        cannot: PlayTypes.PlayFromHand
                    })
                })
            ]
        });
    }
}


export default AkodoToturi2;
