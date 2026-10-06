import { sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class SageOfGiseiToshi extends DrawCard {
    static id = 'sage-of-gisei-toshi';

    setupCardAbilities() {
        this.action('Move home, then move character home')
            .condition((context) => context.player.isMoreHonorable())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('sendHome', context)
            })
            .gameAction(sendHome())
            .then((context) => ({
                gameAction: sendHome({ target: context.target })
            }));
    }
}


export default SageOfGiseiToshi;
