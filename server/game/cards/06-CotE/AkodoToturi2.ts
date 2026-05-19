import DrawCard from '../../drawcard.js';
import { Players, PlayTypes } from '../../Constants.js';

class AkodoToturi2 extends DrawCard {
    static id = 'akodo-toturi-2';

    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent each player playing cards from hand',
            condition: context => context.source.isParticipating() && context.player.imperialFavor !== '',
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
