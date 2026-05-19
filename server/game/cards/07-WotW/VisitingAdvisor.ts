import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class VisitingAdvisor extends DrawCard {
    static id = 'visiting-advisor';

    setupCardAbilities() {
        this.action({
            title: 'Send this and up to 1 other character home',
            condition: context => context.source.isParticipating(),
            target: {
                controller: Players.Self,
                cardType: CardTypes.Character,
                optional: true,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.sendHome()
            },
            gameAction: AbilityDsl.actions.sendHome(context => ({ target: context.source })),
            effect: 'send {0}{1}{2} home',
            effectArgs: (context) => context.target.length === 0 ? [context.source] : [' and ', context.source]
        });
    }
}


export default VisitingAdvisor;
