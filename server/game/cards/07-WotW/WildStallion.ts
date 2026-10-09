import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { moveToConflict } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class WildStallion extends DrawCard {
    static id = 'wild-stallion';

    setupCardAbilities() {
        this.action('Move this and another character to the conflict')
            .condition((context) => !!(context.game.currentConflict && !context.source.isParticipating()))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, moveToConflict())
            .moveToConflict()
            .chatText((context) => {
                const t = context.targets.target;
                const hasAny = Array.isArray(t) ? t.length > 0 : !!t;
                return hasAny
                    ? msg`move ${context.chatTarget()} and ${context.source} into the conflict`
                    : msg`move ${context.chatTarget()}${context.source} into the conflict`;
            });
    }
}


export default WildStallion;
