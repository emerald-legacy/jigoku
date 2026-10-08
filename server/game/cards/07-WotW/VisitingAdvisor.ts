import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

class VisitingAdvisor extends DrawCard {
    static id = 'visiting-advisor';

    setupCardAbilities() {
        this.action('Send this and up to 1 other character home')
            .condition((context) => context.source.isParticipating())
            .target({
                controller: Players.Self,
                cardType: CardType.Character,
                optional: true,
                cardCondition: (card, context) => card !== context.source
            }, sendHome())
            .sendHome()
            .chatText((context) => {
                const t = context.targets.target;
                const hasAny = Array.isArray(t) ? t.length > 0 : !!t;
                return hasAny
                    ? msg`send ${context.chatTarget()} and ${context.source} home`
                    : msg`send ${context.chatTarget()}${context.source} home`;
            });
    }
}


export default VisitingAdvisor;
