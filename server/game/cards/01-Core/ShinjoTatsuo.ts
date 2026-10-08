import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class ShinjoTatsuo extends DrawCard {
    static id = 'shinjo-tatsuo';

    setupCardAbilities() {
        this.action('Move this and another character to the conflict')
            .target({
                name: 'self',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card === context.source
            }, moveToConflict())
            .target({
                name: 'optional',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, moveToConflict())
            .chatText((context) => msg`move ${context.chatTarget()}${!Array.isArray(context.targets.optional) ? ' and ' : ''}${!Array.isArray(context.targets.optional) ? context.targets.optional : ''} into the conflict`);
    }
}


export default ShinjoTatsuo;
