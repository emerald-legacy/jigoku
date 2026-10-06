import { playerCannot } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    setupCardAbilities() {
        this.action('Prevent each player playing cards from hand')
            .condition((context) => context.source.isParticipating() && context.player.imperialFavor !== '')
            .gameAction(playerLastingEffect({
                targetController: Players.Any,
                effect: playerCannot({
                    cannot: PlayType.PlayFromHand
                })
            }))
            .effect('prevent each player playing cards from hand');
    }
}


export default AkodoToturi2;
