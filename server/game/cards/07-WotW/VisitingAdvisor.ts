import DrawCard from '../../DrawCard.js';
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
            effectArgs: (context) => {
                const t = context.targets.target;
                const hasAny = Array.isArray(t) ? t.length > 0 : !!t;
                return hasAny ? [' and ', context.source] : [context.source];
            }
        });
    }
}


export default VisitingAdvisor;
