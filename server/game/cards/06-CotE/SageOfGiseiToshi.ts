import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class SageOfGiseiToshi extends DrawCard {
    static id = 'sage-of-gisei-toshi';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move home, then move character home',
            condition: context => context.player.opponent && context.player.isMoreHonorable(),
            gameAction: ability.actions.sendHome(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('sendHome', context)
            },
            then: context => ({
                gameAction: ability.actions.sendHome({ target: context.target })
            })
        });
    }
}


export default SageOfGiseiToshi;
