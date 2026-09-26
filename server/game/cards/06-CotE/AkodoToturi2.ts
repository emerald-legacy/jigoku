import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Prevent each player playing cards from hand')
            .condition((context) => context.source.isParticipating() && context.player.imperialFavor !== '')
            .gameAction(ability.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: ability.effects.playerCannot({
                    cannot: PlayType.PlayFromHand
                })
            }))
            .effect('prevent each player playing cards from hand');
    }
}


export default AkodoToturi2;
