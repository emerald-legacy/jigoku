import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class SageOfGiseiToshi extends DrawCard {
    static id = 'sage-of-gisei-toshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move home, then move character home',
            condition: (context: any) => Boolean(context.player.opponent) && context.player.isMoreHonorable(),
            gameAction: ability.actions.sendHome(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card: any, context: any) => card.isParticipating() && card.allowGameAction('sendHome', context)
            },
            then: (context: any) => ({
                gameAction: ability.actions.sendHome({ target: context?.target })
            })
        });
    }
}


export default SageOfGiseiToshi;
