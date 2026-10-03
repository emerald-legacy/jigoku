import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class SageOfGiseiToshi extends DrawCard {
    static id = 'sage-of-gisei-toshi';

    setupCardAbilities() {
        this.action('Move home, then move character home')
            .condition((context) => Boolean(context.player.opponent) && context.player.isMoreHonorable())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('sendHome', context)
            })
            .gameAction(AbilityDsl.actions.sendHome())
            .then((context) => ({
                gameAction: AbilityDsl.actions.sendHome({ target: context?.target })
            }));
    }
}


export default SageOfGiseiToshi;
