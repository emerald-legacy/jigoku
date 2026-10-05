import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    setupCardAbilities() {
        this.action('Prevent each player playing cards from hand')
            .condition((context) => context.source.isParticipating() && context.player.imperialFavor !== '')
            .gameAction(AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: PlayType.PlayFromHand
                })
            }))
            .effect('prevent each player playing cards from hand');
    }
}


export default AkodoToturi2;
