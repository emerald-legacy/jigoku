import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { cancel } from '../../GameActions/GameActions.js';

class IkebanaArtisan extends DrawCard {
    static id = 'ikebana-artisan';

    override setupCardAbilities() {
        this.wouldInterrupt('Lose fate instead of honor')
            .when({
                onModifyHonor: (event, context) => event.dueToUnopposed && event.player === context.player
            })
            .gameAction(cancel())
            .chatText((context) => context.player.fate > 0
                ? msg`lose 1 fate rather than 1 honor for not defending the conflict`
                : msg`cancel the honor loss for not defending the conflict`)
            .limit(unlimited())
            .then()
            .loseFate((context) => ({ target: context.player }));
    }
}


export default IkebanaArtisan;
