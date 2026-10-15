import { playerCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    override setupCardAbilities() {
        this.action('Prevent each player playing cards from hand')
            .condition((context) => context.source.isParticipating() && context.player.imperialFavor !== '')
            .playerLastingEffect({
                target: Players.Any,
                effect: playerCannot({
                    cannot: PlayType.PlayFromHand
                })
            })
            .chatText('prevent each player playing cards from hand');
    }
}


export default AkodoToturi2;
