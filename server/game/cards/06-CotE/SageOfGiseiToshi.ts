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
                cardCondition: (card, context) => card.isParticipating() && sendHome().canAffect(card, context)
            })
            .sendHome()
            .afterwards()
            .sendHome((context) => ({ target: context.target }));
    }
}


export default SageOfGiseiToshi;
