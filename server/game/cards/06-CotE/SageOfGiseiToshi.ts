import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';

class SageOfGiseiToshi extends DrawCard {
    static id = 'sage-of-gisei-toshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move home, then move character home',
            condition: (context: AbilityContext) => Boolean(context.player.opponent) && context.player.isMoreHonorable(),
            gameAction: ability.actions.sendHome(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card: any, context: any) => card.isParticipating() && card.allowGameAction('sendHome', context)
            },
            then: (context: AbilityContext) => ({
                gameAction: ability.actions.sendHome({ target: context?.target })
            })
        });
    }
}


export default SageOfGiseiToshi;
